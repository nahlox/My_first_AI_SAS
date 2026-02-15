import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    const { name, company, title, linkedin_url } = await request.json();

    if (!name || !company || !title) {
      return NextResponse.json(
        { error: 'Name, company, and title are required' },
        { status: 400 }
      );
    }

    const { data: creditsData, error: creditsError } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !creditsData || creditsData.balance < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    const prompt = `You are a cold email research assistant. Generate detailed research for the following prospect:

Name: ${name}
Company: ${company}
Title: ${title}
${linkedin_url ? `LinkedIn: ${linkedin_url}` : ''}

Provide the following in your response:

1. 3-5 key insights about this prospect and their role
2. 3-5 likely pain points they face in their position
3. 3-5 personalization angles for outreach
4. A personalized cold email (150-200 words) that:
   - Has a compelling subject line
   - Opens with a relevant personalization
   - Clearly states value proposition
   - Includes a specific call-to-action
   - Is professional but conversational

Format your response as JSON with this structure:
{
  "insights": ["insight 1", "insight 2", ...],
  "pain_points": ["pain 1", "pain 2", ...],
  "personalization_angles": ["angle 1", "angle 2", ...],
  "cold_email": "The complete email with subject line"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    let aiOutput;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiOutput = JSON.parse(jsonMatch[0]);
      } else {
        aiOutput = {
          insights: ['Unable to generate insights'],
          pain_points: ['Unable to generate pain points'],
          personalization_angles: ['Unable to generate angles'],
          cold_email: responseText,
        };
      }
    } catch (parseError) {
      aiOutput = {
        insights: ['Unable to generate insights'],
        pain_points: ['Unable to generate pain points'],
        personalization_angles: ['Unable to generate angles'],
        cold_email: responseText,
      };
    }

    const { error: insertError } = await supabase.from('research').insert({
      user_id: user.id,
      prospect_name: name,
      prospect_company: company,
      prospect_title: title,
      linkedin_url: linkedin_url || null,
      ai_output: aiOutput,
    });

    if (insertError) {
      console.error('Error inserting research:', insertError);
      return NextResponse.json(
        { error: 'Failed to save research' },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from('credits')
      .update({ balance: creditsData.balance - 1 })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
    }

    return NextResponse.json({
      success: true,
      data: aiOutput,
      credits_remaining: creditsData.balance - 1,
    });
  } catch (error: any) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

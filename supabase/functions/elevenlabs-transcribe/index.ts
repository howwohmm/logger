
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    console.log('Received audio file:', audioFile.name, 'Size:', audioFile.size)

    // Prepare form data for ElevenLabs API
    const elevenLabsFormData = new FormData()
    elevenLabsFormData.append('file', audioFile)
    elevenLabsFormData.append('model_id', 'scribe_v1')
    elevenLabsFormData.append('language_code', 'en')
    elevenLabsFormData.append('tag_audio_events', 'true')
    elevenLabsFormData.append('diarize', 'false')
    elevenLabsFormData.append('timestamps_granularity', 'word')

    console.log('Sending request to ElevenLabs API...')

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': 'sk_d0cf142b9b0e4392340006d2d0cf8fbbedf98c8640ba200b',
      },
      body: elevenLabsFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('ElevenLabs response:', result)

    return new Response(
      JSON.stringify({ 
        transcript: result.text,
        language_code: result.language_code,
        language_probability: result.language_probability,
        words: result.words
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Transcription error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

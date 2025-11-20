'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Loader2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface VoiceTextInputProps {
  areaName: string
  onSubmit: (text: string, isVoice: boolean) => void
  onTranscriptUpdate?: (transcript: string) => void
  placeholder?: string
  disabled?: boolean
}

export function VoiceTextInput({
  areaName,
  onSubmit,
  onTranscriptUpdate,
  placeholder = 'Describe lo que necesitas para esta área...',
  disabled = false
}: VoiceTextInputProps) {
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Web Speech API recognition
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Web Speech API if available
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'es-CR' // Costa Rican Spanish

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' '
          } else {
            interimTranscript += transcriptPiece
          }
        }

        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        onTranscriptUpdate?.(currentTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError(`Error: ${event.error}`)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        if (isRecording) {
          // Restart if still supposed to be recording
          recognitionRef.current?.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isRecording, onTranscriptUpdate])

  const startRecording = () => {
    if (!recognitionRef.current) {
      setError('La grabación de voz no está disponible en este navegador')
      return
    }

    try {
      setIsRecording(true)
      setTranscript('')
      setError(null)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('No se pudo iniciar la grabación')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)

    // If we have a transcript, use it
    if (transcript.trim()) {
      setInputText(transcript)
    }
  }

  const handleSubmit = async () => {
    const textToSubmit = inputText.trim()
    if (!textToSubmit || disabled) return

    setIsProcessing(true)
    try {
      await onSubmit(textToSubmit, transcript.length > 0)
      setInputText('')
      setTranscript('')
    } catch (error) {
      console.error('Error submitting:', error)
      setError('Error al procesar. Por favor intenta de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const suggestions = [
    'Necesito grifería moderna para cocina',
    'Quiero reemplazar el lavamanos',
    'Busco cerraduras resistentes al clima costero',
    'Necesito pisos impermeables para baño',
    'Quiero herrajes de diseño moderno'
  ]

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-alumimundo-navy">
          Describe tus Necesidades
        </h3>
        {(isRecording || isProcessing) && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{isRecording ? 'Grabando...' : 'Procesando...'}</span>
          </div>
        )}
      </div>

      {/* Voice Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-75" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Escuchando...</p>
                  {transcript && (
                    <p className="text-sm text-red-700 mt-1 italic">
                      "{transcript}"
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <Card className="p-3 bg-red-50 border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isRecording}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-alumimundo-navy focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          {/* Voice Button */}
          <Button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isProcessing}
            className={`${
              isRecording
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-alumimundo-teal hover:bg-alumimundo-teal/90'
            } text-white p-3`}
            aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          {/* Send Button */}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!inputText.trim() || disabled || isProcessing}
            className="bg-alumimundo-navy hover:bg-alumimundo-navy/90 text-white p-3"
            aria-label="Send message"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      {!inputText && !isRecording && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Ejemplos:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputText(suggestion)}
                disabled={disabled}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-alumimundo-navy/10 rounded-full text-gray-700 hover:text-alumimundo-navy transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        <Volume2 className="w-3 h-3 inline mr-1" />
        Usa el micrófono para hablar o escribe tu mensaje
      </p>
    </div>
  )
}

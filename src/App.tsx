/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { 
  Utensils, 
  Heart, 
  Eye, 
  MessageSquare, 
  Activity, 
  Users, 
  ChevronRight, 
  CheckCircle2, 
  Mic, 
  Volume2,
  Info,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getGeminiResponse, SYSTEM_PROMPT } from "@/src/lib/gemini";
import { PREDIMED_TEST, MENU_1500_KCAL, MENU_1800_KCAL, EXCHANGES } from "@/src/constants/diet";

export default function App() {
  const [kcalGoal, setKcalGoal] = useState<1500 | 1800>(1800);
  const [testAnswers, setTestAnswers] = useState<Record<number, boolean>>({});
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [menuPrompt, setMenuPrompt] = useState("");
  const [menuResponse, setMenuResponse] = useState("");
  const [isMenuTyping, setIsMenuTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsRecording(false);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const score = Object.values(testAnswers).filter(Boolean).length;
  const progressValue = (score / 14) * 100;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    const aiMsg = await getGeminiResponse(userMsg, SYSTEM_PROMPT);
    setChatHistory(prev => [...prev, { role: "ai", content: aiMsg }]);
    setIsTyping(false);
  };

  const handleMenuPrompt = async () => {
    if (!menuPrompt.trim()) return;
    setIsMenuTyping(true);
    const response = await getGeminiResponse(menuPrompt, SYSTEM_PROMPT + "\n\nResponde específicamente sobre el menú del día.");
    setMenuResponse(response);
    setIsMenuTyping(false);
  };

  const toggleAnswer = (id: number) => {
    setTestAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-serif text-[#1a1a1a]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#5A5A40]/10 bg-[#f5f5f0]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A5A40] text-white">
              <Heart className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#5A5A40]">Vida Mediterránea AI</span>
          </div>
          <div className="hidden space-x-8 md:flex">
            <a href="#" className="text-sm font-medium hover:text-[#5A5A40]">Inicio</a>
            <a href="#" className="text-sm font-medium hover:text-[#5A5A40]">Guías Clínicas</a>
            <a href="#" className="text-sm font-medium hover:text-[#5A5A40]">Contacto</a>
          </div>
          <Button variant="outline" className="rounded-full border-[#5A5A40] text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white">
            Mi Perfil
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl text-[#5A5A40]"
          >
            Salud Integral y Buen Vivir
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-[#5A5A40]/70"
          >
            Descubre el poder de la dieta mediterránea con el respaldo de guías clínicas expertas y tecnología de vanguardia.
          </motion.p>
        </section>

        <Tabs defaultValue="planner" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 rounded-xl bg-white p-1 shadow-sm border border-[#5A5A40]/10">
            <TabsTrigger value="planner" className="rounded-lg data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white">
              <Utensils className="mr-2 h-4 w-4" /> Planificador
            </TabsTrigger>
            <TabsTrigger value="test" className="rounded-lg data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Test Adherencia
            </TabsTrigger>
            <TabsTrigger value="assistant" className="rounded-lg data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white">
              <MessageSquare className="mr-2 h-4 w-4" /> Asistente AI
            </TabsTrigger>
            <TabsTrigger value="wellness" className="rounded-lg data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white">
              <Activity className="mr-2 h-4 w-4" /> Bienestar
            </TabsTrigger>
          </TabsList>

          {/* Planner Tab */}
          <TabsContent value="planner" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#5A5A40] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Menú del Día</CardTitle>
                      <CardDescription className="text-white/80">Basado en guías clínicas del Hospital Reina Sofía</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={kcalGoal === 1500 ? "secondary" : "outline"} 
                        onClick={() => setKcalGoal(1500)}
                        className="rounded-full"
                      >
                        1500 kcal
                      </Button>
                      <Button 
                        variant={kcalGoal === 1800 ? "secondary" : "outline"} 
                        onClick={() => setKcalGoal(1800)}
                        className="rounded-full"
                      >
                        1800 kcal
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-4">
                    {Object.entries(kcalGoal === 1800 ? MENU_1800_KCAL : MENU_1500_KCAL).map(([meal, desc]) => (
                      <div key={meal} className="flex gap-4 p-4 rounded-2xl bg-[#f5f5f0]/50 border border-[#5A5A40]/5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Utensils className="h-6 w-6 text-[#5A5A40]" />
                        </div>
                        <div>
                          <h4 className="font-bold capitalize text-[#5A5A40]">{meal}</h4>
                          <p className="text-sm text-[#1a1a1a]/70">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[#5A5A40]/10">
                    <div className="flex gap-2">
                      <input 
                        value={menuPrompt}
                        onChange={(e) => setMenuPrompt(e.target.value)}
                        placeholder="¿Dudas sobre este menú?"
                        className="flex-1 bg-[#f5f5f0] border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
                      />
                      <Button onClick={handleMenuPrompt} className="rounded-full bg-[#5A5A40] hover:bg-[#4a4a35]">
                        {isMenuTyping ? "..." : "Consultar"}
                      </Button>
                    </div>
                    {menuResponse && (
                      <p className="mt-4 text-sm text-[#1a1a1a]/80 bg-[#f5f5f0] p-4 rounded-2xl">{menuResponse}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#5A5A40]">
                      <Scale className="h-5 w-5" /> Tabla de Intercambios
                    </CardTitle>
                    <CardDescription>Personaliza tu menú con equivalencias</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {EXCHANGES.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{ex.amount} {ex.name}</span>
                        <ChevronRight className="h-4 w-4 text-[#5A5A40]/30" />
                        <span className="text-[#5A5A40] font-bold">{ex.equivalent}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground italic">
                      * Consulta siempre con tu nutricionista antes de realizar cambios estructurales.
                    </p>
                  </CardFooter>
                </Card>

                <Card className="border-none shadow-sm bg-[#5A5A40] text-white rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" /> Salud Visual
                    </CardTitle>
                    <CardDescription className="text-white/80">Nutrientes esenciales para tus ojos</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm space-y-4">
                    <div className="space-y-2">
                      <p className="font-bold">Alimentos Estrella:</p>
                      <ul className="list-disc list-inside space-y-1 opacity-90">
                        <li><strong>Calabaza:</strong> Betacarotenos que el cuerpo convierte en Vitamina A.</li>
                        <li><strong>Laurel:</strong> Sus antioxidantes protegen los tejidos oculares.</li>
                        <li><strong>Zanahoria:</strong> Mejora la visión nocturna.</li>
                        <li><strong>Espinacas:</strong> Filtran la luz azul dañina.</li>
                      </ul>
                    </div>
                    <Separator className="bg-white/20" />
                    <p className="text-xs opacity-80">
                      Basado en recomendaciones de oftalmología preventiva de centros de salud integrales.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test">
            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-[#5A5A40] text-white">
                <CardTitle>Test PREDIMED de 14 Puntos</CardTitle>
                <CardDescription className="text-white/80">Mide tu adherencia a la Dieta Mediterránea</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-8 space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Tu Puntuación: {score} / 14</span>
                    <span>{score >= 9 ? "Adherencia Alta" : score >= 5 ? "Adherencia Media" : "Adherencia Baja"}</span>
                  </div>
                  <Progress value={progressValue} className="h-3 bg-[#f5f5f0]" />
                </div>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {PREDIMED_TEST.map((q) => (
                      <div 
                        key={q.id} 
                        onClick={() => toggleAnswer(q.id)}
                        className={`flex cursor-pointer items-center justify-between p-4 rounded-2xl transition-all ${
                          testAnswers[q.id] ? "bg-[#5A5A40]/10 border-[#5A5A40]/20" : "bg-[#f5f5f0]/50 border-transparent"
                        } border`}
                      >
                        <span className="text-sm font-medium pr-4">{q.id}. {q.question}</span>
                        {testAnswers[q.id] ? (
                          <CheckCircle2 className="h-6 w-6 text-[#5A5A40] shrink-0" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-[#5A5A40]/20 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="bg-[#f5f5f0]/50 p-6">
                <div className="flex items-start gap-3 text-sm text-[#5A5A40]">
                  <Info className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>Este test es una herramienta de cribado validada. Una puntuación ≥ 9 indica una buena adherencia a los patrones mediterráneos saludables.</p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Assistant Tab */}
          <TabsContent value="assistant">
            <Card className="border-none shadow-sm bg-white rounded-3xl h-[600px] flex flex-col overflow-hidden">
              <CardHeader className="bg-[#5A5A40] text-white shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" /> Asistente Conversacional
                    </CardTitle>
                    <CardDescription className="text-white/80">Pregunta sobre recetas, ingredientes o beneficios</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={`rounded-full hover:bg-white/20 ${isRecording ? "text-red-500 animate-pulse" : ""}`}
                      onClick={toggleRecording}
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/20">
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {chatHistory.length === 0 && (
                      <div className="text-center py-12 space-y-4">
                        <div className="mx-auto h-16 w-16 bg-[#f5f5f0] rounded-full flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-[#5A5A40]" />
                        </div>
                        <p className="text-[#5A5A40]/60">¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setChatInput("¿Qué beneficios tiene el aceite de oliva?")} className="rounded-full">Beneficios AOVE</Button>
                          <Button variant="outline" size="sm" onClick={() => setChatInput("Dame una receta con calabaza")} className="rounded-full">Receta Calabaza</Button>
                          <Button variant="outline" size="sm" onClick={() => setChatInput("¿Cómo reducir la sal?")} className="rounded-full">Menos Sal</Button>
                        </div>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === "user" 
                            ? "bg-[#5A5A40] text-white rounded-tr-none" 
                            : "bg-[#f5f5f0] text-[#1a1a1a] rounded-tl-none"
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#f5f5f0] p-4 rounded-2xl rounded-tl-none">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 bg-[#5A5A40]/30 rounded-full animate-bounce" />
                            <span className="h-2 w-2 bg-[#5A5A40]/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="h-2 w-2 bg-[#5A5A40]/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t border-[#f5f5f0] bg-white shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex w-full gap-2"
                >
                  <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escribe tu duda aquí..."
                    className="flex-1 bg-[#f5f5f0] border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
                  />
                  <Button type="submit" className="rounded-full bg-[#5A5A40] hover:bg-[#4a4a35]">
                    Enviar
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#5A5A40]">
                    <Activity className="h-6 w-6" /> Actividad Física
                  </CardTitle>
                  <CardDescription>El complemento ideal de tu nutrición</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#f5f5f0]/50 border border-[#5A5A40]/5">
                    <h4 className="font-bold text-[#5A5A40] mb-2">Caminar 30 min/día</h4>
                    <p className="text-sm opacity-70">Un paseo a ritmo ligero mejora la circulación y el estado de ánimo.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f5f5f0]/50 border border-[#5A5A40]/5">
                    <h4 className="font-bold text-[#5A5A40] mb-2">Fuerza y Flexibilidad</h4>
                    <p className="text-sm opacity-70">Realiza ejercicios de estiramiento al menos 2 veces por semana.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#5A5A40]">
                    <Users className="h-6 w-6" /> Socialización y Cocina
                  </CardTitle>
                  <CardDescription>La mesa como punto de encuentro</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#f5f5f0]/50 border border-[#5A5A40]/5">
                    <h4 className="font-bold text-[#5A5A40] mb-2">Comer en Compañía</h4>
                    <p className="text-sm opacity-70">Socializar reduce el estrés y ayuda a comer de forma más consciente.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f5f5f0]/50 border border-[#5A5A40]/5">
                    <h4 className="font-bold text-[#5A5A40] mb-2">Técnicas Saludables</h4>
                    <p className="text-sm opacity-70">Prioriza el vapor, el horno y la plancha. Usa especias para reducir la sal.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border-none shadow-sm bg-[#5A5A40] text-white rounded-3xl overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-bold">Filosofía del Buen Vivir</h3>
                    <p className="opacity-90 leading-relaxed">
                      La Dieta Mediterránea no es solo un plan de alimentación, es un estilo de vida que combina ingredientes de calidad, 
                      actividad física moderada y el placer de compartir. Nuestro objetivo es prevenir enfermedades cardiovasculares 
                      y mejorar tu longevidad a través del equilibrio.
                    </p>
                    <div className="flex gap-4">
                      <Badge variant="secondary" className="bg-white/20 text-white border-none px-4 py-1">Aceite de Oliva</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-none px-4 py-1">Fibra</Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-none px-4 py-1">Socialización</Badge>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 aspect-video rounded-2xl bg-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/mediterranean/800/600')] bg-cover bg-center opacity-50 transition-transform group-hover:scale-110" />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-[#5A5A40] shadow-lg">
                        <Volume2 className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Video Motivacional</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-20 border-t border-[#5A5A40]/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-[#5A5A40]/60">
            © 2026 Vida Mediterránea AI. Basado en guías clínicas de hospitales públicos.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="text-xs font-medium text-[#5A5A40]/40 hover:text-[#5A5A40]">Privacidad</a>
            <a href="#" className="text-xs font-medium text-[#5A5A40]/40 hover:text-[#5A5A40]">Términos</a>
            <a href="#" className="text-xs font-medium text-[#5A5A40]/40 hover:text-[#5A5A40]">Accesibilidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

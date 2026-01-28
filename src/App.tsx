import React, { useState, useEffect } from 'react';
import { Copy, Cpu, Sparkles, Loader2, Type, Palette, Monitor, Smartphone, Square, Box, PenTool, Brush, Brain, History, Component, Wrench, Package, Film, FileText, Search, Home, Hash, Zap, ChevronDown } from 'lucide-react'; 

// 类型定义
type StructureType = 'layered' | 'map' | 'hex' | 'dollhouse'; 
type Section = { 
  id: number; 
  title: string; 
  label: string; 
  desc: string; 
  elements: string; 
};

type PromptMode = 'evolution' | 'breakdown';
type InputMode = 'topic' | 'text';

type StyleOption = {
  id: string;
  label: string;
  header: string;
  desc: string;
  icon: React.ReactNode;
};

type ModelOption = {
  id: string;
  name: string;
  provider: string;
};

// 可用模型列表 (OpenRouter 模型 ID)
const MODEL_OPTIONS: ModelOption[] = [
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'google/gemini-2.5-pro-preview-03-25', name: 'Gemini 2.5 Pro', provider: 'Google' },
];

const App = () => {
  // 核心状态
  const [mode, setMode] = useState<PromptMode>('evolution');
  const [inputMode, setInputMode] = useState<InputMode>('topic');
  const [topic, setTopic] = useState('History of Communication');
  const [sourceText, setSourceText] = useState('');
  const [structure, setStructure] = useState<StructureType>('layered');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [visualStyle, setVisualStyle] = useState('pixel');
  const [sectionCount, setSectionCount] = useState(3); // 新增：分段数量控制
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].id); // 模型选择
  
  // 扩展的元数据
  const [titles, setTitles] = useState({
    en: "COMMUNICATION EVOLUTION",
    cn: "通信演化史",
    sub: "From Smoke Signals to Quantum Internet / 从狼烟到量子网络"
  });

  const [philosophicalMetaphor, setPhilosophicalMetaphor] = useState(
    "Visual metaphors for this topic as humanity's mirror. Symbolic representation of the tension between tradition and innovation."
  );

  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: "ANCIENT FOUNDATIONS", label: "Prehistory - 1400 CE", desc: "Cave paintings, smoke signals, courier pigeons, stone tablets", elements: "Cave walls, fire pits, scrolls" },
    { id: 2, title: "PRINTING REVOLUTION", label: "1440 - 1800", desc: "Gutenberg press, newspapers, mass literacy spreading ideas", elements: "Printing press, ink jars, books" },
    { id: 3, title: "DIGITAL ERA", label: "1980 - Future", desc: "Smartphones, global fiber optics, neural link interfaces", elements: "Fiber optic cables, holograms, satellites" }
  ]);
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copyStatus, setCopyStatus] = useState('复制 Prompt');

  // 预设模版结构描述
  const structureDescriptions = {
    layered: "Museum/gallery structure with stacked interconnected wings representing different eras/sections ascending upwards.",
    map: "Winding path connecting different distinct zones in a continuous journey.",
    hex: "Interconnected hexagonal cells forming a hive of concepts, each cell representing a distinct component.",
    dollhouse: "STRICTLY 2D flat front-facing cross-section view (dollhouse cutaway style). Side-view revealing multiple rooms and internal layers. ABSOLUTELY NO isometric or 3D perspective. Pure straight-on 90-degree frontal view like a Wes Anderson movie set or architectural elevation drawing." 
  };

  // 比例选项
  const ratioOptions = [
    { label: 'Portrait (3:4)', value: '3:4', icon: <Smartphone className="w-4 h-4 rotate-0" /> },
    { label: 'Portrait (9:16)', value: '9:16', icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Landscape (4:3)', value: '4:3', icon: <Monitor className="w-4 h-4" /> },
    { label: 'Landscape (16:9)', value: '16:9', icon: <Monitor className="w-4 h-4" /> },
    { label: 'Square (1:1)', value: '1:1', icon: <Square className="w-4 h-4" /> },
  ];

  // 风格定义
  const styleOptions: StyleOption[] = [
    { 
      id: 'pixel', 
      label: '16-bit Pixel Art', 
      header: 'SYMBOLIC METAPHORICAL ISOMETRIC PIXEL ART',
      desc: 'Ultra-detailed isometric pixel art with symbolic and metaphorical depth. Extremely fine pixel details with meticulous shading and highlights. Clean, professional: Profound, symbolic, metaphorical isometric pixel world.',
      icon: <Cpu className="w-4 h-4" />
    },
    { 
      id: 'claymation',
      label: 'Claymation Stop Motion',
      header: 'STOP-MOTION CLAYMATION DIORAMA',
      desc: 'Handcrafted claymation aesthetic with visible fingerprint textures and imperfections. Soft, studio lighting simulating a physical miniature set. Chunky, tactile forms with a playful, handmade feel. Shallow depth of field to enhance the scale.',
      icon: <Film className="w-4 h-4" />
    },
    { 
      id: 'voxel', 
      label: 'Voxel Block Art', 
      header: '3D VOXEL ART DIORAMA',
      desc: 'Digital blocky art style similar to MagicaVoxel or Minecraft. Constructed from 3D cubes with vibrant global illumination and soft shadows. Playful, digital toy aesthetic with distinct cubic geometry and clean surfaces.',
      icon: <Package className="w-4 h-4" />
    },
    { 
      id: 'steampunk', 
      label: 'Steampunk Machinery', 
      header: 'INTRICATE STEAMPUNK MACHINERY',
      desc: 'Victorian industrial aesthetic with brass gears, copper pipes, and steam engines. Intricate mechanical details, sepia and bronze color palette, vintage scientific instrument look with glass and metal textures.',
      icon: <Wrench className="w-4 h-4" />
    },
    { 
      id: 'sketch', 
      label: 'Architecture Sketch', 
      header: 'ARCHITECTURAL BLUEPRINT SKETCH STYLE',
      desc: 'Detailed architectural line drawing with pencil textures and blueprint aesthetics. Precise isometric lines, technical annotations, and rough sketch shading. Professional architect portfolio style, monochrome with subtle accent colors.',
      icon: <PenTool className="w-4 h-4" />
    },
    { 
      id: 'watercolor', 
      label: 'Watercolor Drawing', 
      header: 'ARTISTIC WATERCOLOR ILLUSTRATION',
      desc: 'Soft, fluid watercolor painting style with visible paper texture and ink wash effects. Dreamy, artistic atmosphere with gentle color bleeding and organic edges. Hand-painted aesthetic with wet-on-wet techniques.',
      icon: <Brush className="w-4 h-4" />
    },
    { 
      id: 'c4d', 
      label: 'Cute 3D C4D', 
      header: '3D C4D RENDER STYLE',
      desc: 'Cute, plastic-looking 3D render style similar to Cinema 4D or Blender. Soft global illumination, rounded edges, vibrant materials, and toy-like aesthetics. Playful, modern 3D design with clay or matte finishes.',
      icon: <Box className="w-4 h-4" />
    },
    { 
      id: 'dollhouse', 
      label: 'Miniature Dollhouse', 
      header: 'COZY MINIATURE DOLLHOUSE AESTHETIC',
      desc: 'Warm, nostalgic dollhouse aesthetic with rich interior details. Miniature furniture, cozy ambient lighting, pastel and earthy color palette. Each room tells a story with tiny decorative objects, potted plants, and lived-in details. Soft diffused studio lighting, rich material textures, handcrafted miniature model feel.',
      icon: <Home className="w-4 h-4" />
    }
  ];

  // 切换模式时的默认值处理
  const switchMode = (newMode: PromptMode) => {
    setMode(newMode);
    if (newMode === 'breakdown') {
      if (inputMode === 'topic') setTopic('Enterprise Data Center');
      setTitles({
        en: "DATA CENTER ANATOMY",
        cn: "数据中心解构",
        sub: "Core Architecture and Infrastructure / 核心架构与基础设施"
      });
      // ... default sections
      setPhilosophicalMetaphor("Visual metaphor of a digital brain pulsating with information. The physical manifestation of the virtual cloud.");
    } else {
      if (inputMode === 'topic') setTopic('History of Communication');
      // ... default sections
    }
  };

  const handleAiResearch = async () => {
    if (inputMode === 'topic' && !topic) return;
    if (inputMode === 'text' && !sourceText) return;

    setIsGenerating(true);
    
    try {
      const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
      const url = "https://openrouter.ai/api/v1/chat/completions";

      let promptText = "";
      
      if (inputMode === 'text') {
        promptText = `Act as an expert art director and content analyst.
Task: Analyze the provided text below and extract structure for an isometric poster in **${mode === 'evolution' ? 'EVOLUTION' : 'BREAKDOWN'}** mode.

Input Text:
"""
${sourceText}
"""

Output strictly valid JSON with this structure:
{
  "englishTitle": "Short Uppercase Title based on text content",
  "chineseTitle": "Short Chinese Title based on text content",
  "subtitle": "Bilingual Subtitle summarizing the text",
  "philosophicalMetaphor": "Poetic metaphor based on text's deeper meaning.",
  "eras": [
    {
      "title": "Section Title extracted from text",
      "label": "${mode === 'evolution' ? 'Time Period' : 'Function/Category'}",
      "description": "Visual description based on text content.",
      "symbolicElements": "Concrete objects mentioned or implied in text"
    }
  ]
}
Create exactly ${sectionCount} key sections. Prioritize the most important content. Return ONLY valid JSON, no markdown.`;
      } else {
        if (mode === 'evolution') {
          promptText = `Act as an expert art director and historian. Topic: "${topic}".
Task: Break this topic down into an **evolution timeline** for an isometric poster.
Output strictly valid JSON:
{
  "englishTitle": "Short Uppercase Title",
  "chineseTitle": "Short Chinese Title",
  "subtitle": "Bilingual Subtitle",
  "philosophicalMetaphor": "Poetic metaphor about time/evolution.",
  "eras": [
    {
      "title": "Era Name",
      "label": "Time Period (e.g. 1900-1950)",
      "description": "Visual description of key events.",
      "symbolicElements": "Concrete objects"
    }
  ]
}
Create exactly ${sectionCount} eras. Return ONLY valid JSON, no markdown.`;
        } else {
          promptText = `Act as an expert technical architect and art director. Topic: "${topic}".
Task: Break this topic down into its **key structural components or functional layers** (Deconstruction/Anatomy) for an isometric poster.
Output strictly valid JSON:
{
  "englishTitle": "Short Uppercase Title",
  "chineseTitle": "Short Chinese Title",
  "subtitle": "Bilingual Subtitle",
  "philosophicalMetaphor": "Poetic metaphor about structure/function/complexity.",
  "eras": [
    {
      "title": "Component/Layer Name",
      "label": "Function/Category (e.g. Power, Core, Interface)",
      "description": "Visual description of this part's appearance and role.",
      "symbolicElements": "Concrete objects"
    }
  ]
}
Create exactly ${sectionCount} key sections. Return ONLY valid JSON, no markdown.`;
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt Generator'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { 
              role: "system", 
              content: "You are an expert art director. Always respond with valid JSON only, no markdown code blocks." 
            },
            { role: "user", content: promptText }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content;
      
      if (!resultText) throw new Error("No content generated");

      // 清理可能的 markdown 代码块和其他格式问题
      let cleanedText = resultText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s*[\r\n]/gm, '') // 移除空行
        .trim();
      
      // 尝试提取 JSON 对象（处理可能的前后多余文本）
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      console.log("API Response:", cleanedText);
      
      let responseJson = JSON.parse(cleanedText);
      console.log("Parsed JSON:", responseJson);
      
      // 如果返回的是数组，取第一个元素
      if (Array.isArray(responseJson)) {
        responseJson = responseJson[0];
      }
      
      // 验证必要字段
      if (!responseJson || !responseJson.englishTitle || !responseJson.chineseTitle) {
        throw new Error("响应缺少必要字段");
      }
      
      setTitles({
        en: responseJson.englishTitle || "UNTITLED",
        cn: responseJson.chineseTitle || "未命名",
        sub: responseJson.subtitle || ""
      });
      
      if (responseJson.philosophicalMetaphor) {
        setPhilosophicalMetaphor(responseJson.philosophicalMetaphor);
      }

      // 安全处理 eras 数组
      const erasArray = responseJson.eras || responseJson.sections || [];
      if (erasArray.length === 0) {
        throw new Error("未生成有效的分段内容");
      }
      
      const newSections = erasArray.map((era: any, index: number) => ({
        id: index + 1,
        title: era.title || `Section ${index + 1}`,
        label: era.label || era.period || "",
        desc: era.description || era.desc || "",
        elements: era.symbolicElements || era.elements || ""
      }));

      setSections(newSections);

    } catch (error) {
      console.error("AI Generation failed:", error);
      alert(`AI 生成失败: ${error instanceof Error ? error.message : '请重试或检查网络'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generatePrompt();
  }, [titles, sections, structure, aspectRatio, visualStyle, philosophicalMetaphor, mode]); 

  const generatePrompt = () => {
    const currentStyle = styleOptions.find(s => s.id === visualStyle) || styleOptions[0];

    // --- 动态透视处理逻辑 ---
    const isIsometric = structure !== 'dollhouse';
    const perspectiveTerm = isIsometric ? "isometric" : "flat architectural cross-section";
    const perspectiveDesc = isIsometric 
      ? "True isometric perspective (2:1 ratio) with precise angles." 
      : "STRICTLY flat front-facing 2D elevation view. Pure straight-on 90-degree frontal perspective like architectural section drawings or Wes Anderson movie sets. ABSOLUTELY NO isometric angle, NO 3D perspective, NO tilted view. Camera perpendicular to the cross-section plane.";
    
    // 清洗风格中的 Isometric 关键词
    let styleHeader = currentStyle.header;
    let styleDesc = currentStyle.desc;
    if (!isIsometric) {
      styleHeader = styleHeader.replace(/ISOMETRIC/g, "FLAT");
      styleDesc = styleDesc.replace(/isometric/g, "flat");
    }
    // ----------------------

    const sectionPrefix = mode === 'evolution' ? "ERA" : "ZONE";
    const conceptHeader = mode === 'evolution' ? "CONCEPT VISUALIZATION - EVOLUTION TIMELINE" : "CONCEPT VISUALIZATION - STRUCTURAL BREAKDOWN";
    const journeyDesc = mode === 'evolution' 
      ? `The journey shows major eras:` 
      : `The structure displays key functional zones/components:`;

    const sectionsText = sections.map((sec, idx) => `
${sectionPrefix} ${idx + 1}: ${sec.title} (${sec.label})
${sec.desc}
Symbolic elements: ${sec.elements}`).join('\n');

    const fullPrompt = `Create a highly detailed ${perspectiveTerm} illustration of ${titles.en.toLowerCase()} ${mode === 'evolution' ? 'history timeline' : 'structural anatomy'} in ${aspectRatio} aspect ratio at 4K resolution. This should be an intricate, symbolic, and metaphorical artwork with bilingual title, focusing on the ${mode === 'evolution' ? 'evolution' : 'composition'} of ${topic}.

VISUAL STYLE - ${styleHeader}:
${styleDesc} Rich intricate architecture and environmental elements. Multiple layers of symbolic meaning and visual metaphors.

${conceptHeader}:
Create a SYMBOLIC ${isIsometric ? 'ISOMETRIC' : 'CROSS-SECTION'} scene: Central feature: A structure representing "${titles.en}".
${journeyDesc}
${sectionsText}

COMPOSITION - SYMBOLIC STRUCTURE:
${perspectiveDesc}
${structureDescriptions[structure]}
Rich environmental details showing ${mode === 'evolution' ? 'styles evolving' : 'internal mechanics and connections'}.
Clear visual hierarchy.
Detailed artworks and symbolic elements appropriate for the style.

COLOR PALETTE - SYMBOLIC COLORS:
Rich, detailed palette with careful placement.
${mode === 'evolution' ? 'Transitioning from ancient tones to modern palettes.' : 'Distinct color coding for different functional zones to show hierarchy.'}
Accent: Highlights representing the essence of each section.

TYPOGRAPHY - BILINGUAL:
English title: "${titles.en}" in matching art font.
Chinese title: "${titles.cn}" in matching art font.
Subtitle: "${titles.sub}".
Both titles integrated into the scene.
Text should maintain ${isIsometric ? 'isometric' : 'flat'} perspective.
High contrast to ensure readability.

PHILOSOPHICAL ELEMENTS:
${philosophicalMetaphor}
This design should showcase SYMBOLIC AND METAPHORICAL ART - with profound layered meaning.`;

    setGeneratedPrompt(fullPrompt.trim());
  };

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPrompt;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyStatus('已复制!');
      setTimeout(() => setCopyStatus('复制 Prompt'), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const updateSection = (id: number, field: keyof Section, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 text-slate-800 font-sans">
      {/* 左侧：控制面板 */}
      <div className="w-full lg:w-5/12 p-6 overflow-y-auto border-r border-gray-200 bg-white shadow-xl z-10">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            提示词演化工厂 (AI版)
          </h1>
          <p className="text-xs text-gray-500 mt-1">Isometric Prompt Generator: Evolution & Breakdown</p>
        </div>

        {/* 0. 模式选择 */}
        <div className="mb-6 bg-slate-100 p-1 rounded-lg flex">
          <button
            onClick={() => switchMode('evolution')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
              mode === 'evolution' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History className="w-4 h-4" /> 演化史 (Evolution)
          </button>
          <button
            onClick={() => switchMode('breakdown')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-all ${
              mode === 'breakdown' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Component className="w-4 h-4" /> 拆解万物 (Breakdown)
          </button>
        </div>

        {/* 1. 调研区域 */}
        <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
             <label className="text-sm font-bold text-indigo-900">1. 内容生成</label>
             <div className="flex bg-indigo-100 p-0.5 rounded text-[10px] font-bold">
               <button 
                 onClick={() => setInputMode('topic')}
                 className={`px-2 py-1 rounded flex items-center gap-1 ${inputMode === 'topic' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400'}`}
               >
                 <Search className="w-3 h-3" /> 智能调研
               </button>
               <button 
                 onClick={() => setInputMode('text')}
                 className={`px-2 py-1 rounded flex items-center gap-1 ${inputMode === 'text' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-400'}`}
               >
                 <FileText className="w-3 h-3" /> 文本分析
               </button>
             </div>
          </div>

          {/* 模型选择器 */}
          <div className="mb-3 px-1">
            <div className="flex items-center gap-1 text-xs text-indigo-800 font-medium mb-1">
              <Zap className="w-3 h-3"/> AI 模型
            </div>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 pr-8 border border-indigo-200 rounded-lg bg-white text-xs font-medium text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
              >
                {MODEL_OPTIONS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
            </div>
          </div>

          <div className="mb-3 px-1">
            <div className="flex items-center justify-between text-xs text-indigo-800 font-medium mb-1">
              <span className="flex items-center gap-1"><Hash className="w-3 h-3"/> 拆分数量: {sectionCount}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="6" 
              value={sectionCount} 
              onChange={(e) => setSectionCount(parseInt(e.target.value))}
              className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1</span><span>6</span>
            </div>
          </div>

          {inputMode === 'topic' ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
                placeholder={mode === 'evolution' ? "例如：Coffee, Internet, Democracy..." : "例如：Data Center, Espresso Machine..."}
              />
              <button 
                onClick={handleAiResearch}
                disabled={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-70 shadow-sm whitespace-nowrap"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                生成
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea 
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs shadow-sm h-32 resize-none"
                placeholder="在此粘贴文章内容、论文摘要或百科文本。AI 将自动分析并提取适合视觉表现的关键点..."
              />
              <button 
                onClick={handleAiResearch}
                disabled={isGenerating || !sourceText}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-sm"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                分析文本并拆解
              </button>
            </div>
          )}
          
          <p className="text-xs text-indigo-400 mt-2 ml-1">
            {inputMode === 'topic' 
              ? "* AI 将利用其知识库自动为您梳理脉络。" 
              : "* AI 将严格基于您提供的文本提取视觉要素。"}
          </p>
        </div>

        {/* 2. 标题信息 */}
        <div className="mb-6 space-y-3">
          <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
            <Type className="w-4 h-4" /> 2. 标题信息 (可手动修改)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="text" 
              value={titles.en}
              onChange={(e) => setTitles({...titles, en: e.target.value})}
              className="p-2 border border-gray-300 rounded text-xs font-mono"
              placeholder="English Title"
            />
            <input 
              type="text" 
              value={titles.cn}
              onChange={(e) => setTitles({...titles, cn: e.target.value})}
              className="p-2 border border-gray-300 rounded text-xs"
              placeholder="中文标题"
            />
          </div>
          <input 
            type="text" 
            value={titles.sub}
            onChange={(e) => setTitles({...titles, sub: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded text-xs text-gray-600"
            placeholder="Subtitle"
          />
        </div>

        {/* 3. 结构选择 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">3. 构图结构</label>
          <div className="flex gap-2">
            {(Object.keys(structureDescriptions) as StructureType[]).map((key) => (
              <button
                key={key}
                onClick={() => setStructure(key)}
                className={`flex-1 py-2 px-1 text-xs font-medium rounded border ${
                  structure === key 
                  ? 'bg-gray-800 text-white border-gray-800' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {key === 'layered' ? '等轴剖面' : key === 'map' ? '蜿蜒路径' : key === 'hex' ? '蜂巢网格' : '玩具屋切面'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. 画幅比例 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">4. 画幅比例</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ratioOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAspectRatio(opt.value)}
                className={`flex items-center justify-center gap-2 py-2 px-2 text-xs font-medium rounded border transition-colors ${
                  aspectRatio === opt.value
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. 视觉风格 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">5. 视觉风格</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVisualStyle(opt.id)}
                className={`flex items-center gap-3 py-2 px-3 text-xs font-medium rounded border transition-all text-left ${
                  visualStyle === opt.id
                  ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`${visualStyle === opt.id ? 'text-purple-600' : 'text-gray-400'}`}>
                  {opt.icon}
                </div>
                <div>
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-70 truncate max-w-[120px]">
                    {opt.id === 'pixel' ? '经典复古像素' : 
                     opt.id === 'claymation' ? '黏土静帧动画' :
                     opt.id === 'steampunk' ? '蒸汽朋克机械' :
                     opt.id === 'voxel' ? '3D体素艺术' :
                     opt.id === 'sketch' ? '蓝图建筑手绘' : 
                     opt.id === 'watercolor' ? '艺术感水彩' :
                     opt.id === 'c4d' ? '3D可爱渲染' : '微缩娃娃屋'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. 详情 */}
        <div className="space-y-4 mb-6">
          <label className="block text-sm font-bold text-gray-700">
            {mode === 'evolution' ? '6. 演化阶段详情' : '6. 结构拆解详情'}
          </label>
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm group hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {mode === 'evolution' ? `ERA ${index + 1}` : `ZONE ${index + 1}`}
                </span>
                <input 
                   value={section.label}
                   onChange={(e) => updateSection(section.id, 'label', e.target.value)}
                   className="text-xs text-right text-gray-500 border-none bg-transparent focus:ring-0 w-32" 
                   placeholder={mode === 'evolution' ? "Time Period" : "Function/Type"}
                />
              </div>
              
              <input 
                value={section.title}
                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                className="w-full font-bold text-sm mb-2 border-b border-gray-100 pb-1 focus:outline-none focus:border-indigo-300"
                placeholder="Title"
              />
              
              <textarea
                value={section.desc}
                onChange={(e) => updateSection(section.id, 'desc', e.target.value)}
                className="w-full text-xs text-gray-600 bg-gray-50 p-2 rounded mb-2 focus:outline-none resize-none"
                rows={2}
                placeholder="Visual description..."
              />
              
              <div className="flex items-center gap-2">
                <Palette className="w-3 h-3 text-gray-400" />
                <input 
                  value={section.elements}
                  onChange={(e) => updateSection(section.id, 'elements', e.target.value)}
                  className="flex-1 text-xs text-gray-500 bg-transparent border-none focus:ring-0 placeholder-gray-300"
                  placeholder="Symbolic elements"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 7. 哲学内核 */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" /> 
            7. {mode === 'evolution' ? '演化哲学 (Metaphor)' : '设计哲学 (Design Logic)'}
          </label>
          <textarea
            value={philosophicalMetaphor}
            onChange={(e) => setPhilosophicalMetaphor(e.target.value)}
            className="w-full text-xs text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-400 min-h-[80px]"
            placeholder={mode === 'evolution' 
              ? "AI 将生成关于时间演化、对立统一的哲学思考..." 
              : "AI 将生成关于系统复杂性、功能互联的哲学思考..."
            }
          />
        </div>
      </div>

      {/* 右侧：结果预览 */}
      <div className="w-full lg:w-7/12 bg-slate-900 text-gray-300 p-8 flex flex-col relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="z-10 flex-1 flex flex-col max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-indigo-400">生成的自然语言提示词</h2>
          </div>
          
          <div className="flex-1 bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-2xl relative backdrop-blur-sm max-h-[70vh] overflow-y-auto">
            <pre className="font-mono text-xs leading-relaxed text-gray-300 whitespace-pre-wrap font-sans pr-16">
              {generatedPrompt}
            </pre>
            
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg text-xs font-bold z-20"
            >
              <Copy className="w-3 h-3" />
              {copyStatus}
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500 flex gap-4 justify-center">
             <p>💡 提示：新的“拆解万物”模式非常适合生成剖面图（Cross-sections）或系统架构图。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
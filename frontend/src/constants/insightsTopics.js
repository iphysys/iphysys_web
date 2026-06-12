// Insights taxonomy tree. Top-level topics map to backend `category` filters.
// Sub-topics map to backend `tag` filters. Both are optional — a topic without
// a category match simply yields an empty archive (structural placeholder).

export const INSIGHTS_TOPICS = [
  {
    key: "ai",
    label: "AI",
    category: null,
    children: [
      { key: "foundations", label: "Foundations", tag: "foundations" },
      { key: "reasoning", label: "Reasoning", tag: "reasoning" },
      { key: "planning", label: "Planning", tag: "planning" },
    ],
  },
  {
    key: "machine-learning",
    label: "Machine Learning",
    category: null,
    children: [
      { key: "supervised", label: "Supervised", tag: "supervised" },
      { key: "unsupervised", label: "Unsupervised", tag: "unsupervised" },
      { key: "reinforcement", label: "Reinforcement", tag: "reinforcement" },
    ],
  },
  {
    key: "deep-learning",
    label: "Deep Learning",
    category: null,
    children: [
      { key: "cnn", label: "CNNs", tag: "cnn" },
      { key: "rnn", label: "RNNs / LSTMs", tag: "rnn" },
      { key: "transformers", label: "Transformers", tag: "transformers" },
      { key: "diffusion", label: "Diffusion Models", tag: "diffusion" },
    ],
  },
  {
    key: "computer-vision",
    label: "Computer Vision",
    category: null,
    children: [
      { key: "detection", label: "Object Detection", tag: "detection" },
      { key: "segmentation", label: "Segmentation", tag: "segmentation" },
      { key: "3d-vision", label: "3D Vision", tag: "3d-vision" },
      { key: "perception", label: "Perception Stacks", tag: "perception" },
    ],
  },
  {
    key: "physical-ai",
    label: "Physical AI",
    category: "Physical AI",
    children: [
      { key: "robotics", label: "Robotics", tag: "robotics" },
      { key: "sensorimotor", label: "Sensorimotor", tag: "sensorimotor" },
      { key: "world-models", label: "World Models", tag: "world-models" },
    ],
  },
  {
    key: "drones",
    label: "Drones / UAV",
    category: null,
    children: [
      { key: "quadrotor", label: "Quadrotor Control", tag: "quadrotor" },
      { key: "swarms", label: "Swarms", tag: "swarms" },
      { key: "mission-planning", label: "Mission Planning", tag: "mission-planning" },
    ],
  },
  {
    key: "edge-ai",
    label: "Edge AI",
    category: "Edge AI",
    children: [
      { key: "latency", label: "Latency Budgets", tag: "latency" },
      { key: "inference", label: "Inference Optimization", tag: "inference" },
      { key: "hardware", label: "Hardware Accelerators", tag: "hardware" },
    ],
  },
  {
    key: "multi-agent",
    label: "Multi-Agent Systems",
    category: "Multi-Agent Systems",
    children: [
      { key: "coordination", label: "Coordination", tag: "coordination" },
      { key: "consensus", label: "Consensus", tag: "consensus" },
      { key: "swarms-mas", label: "Swarms", tag: "swarms" },
    ],
  },
  {
    key: "distributed-optimization",
    label: "Distributed Optimization",
    category: "Distributed Optimization",
    children: [
      { key: "planning-opt", label: "Planning", tag: "planning" },
      { key: "uncertainty", label: "Uncertainty", tag: "uncertainty" },
      { key: "optimization", label: "Optimization", tag: "optimization" },
    ],
  },
  {
    key: "trustworthy-ai",
    label: "Trustworthy AI",
    category: "Trustworthy AI",
    children: [
      { key: "explainability", label: "Explainability", tag: "explainability" },
      { key: "calibration", label: "Calibration", tag: "calibration" },
      { key: "risk", label: "Risk & Confidence", tag: "risk" },
    ],
  },
  {
    key: "engineering-intelligence",
    label: "Engineering Intelligence",
    category: "Engineering Intelligence",
    children: [
      { key: "copilots", label: "Copilots", tag: "copilots" },
      { key: "specifications", label: "Specifications", tag: "specifications" },
      { key: "tooling", label: "Tooling", tag: "tooling" },
    ],
  },
  {
    key: "mission-systems",
    label: "Mission Systems",
    category: "Mission Systems",
    children: [
      { key: "operators", label: "Operators", tag: "operators" },
      { key: "hmt", label: "Human-Machine Teaming", tag: "hmt" },
      { key: "mission", label: "Mission Awareness", tag: "mission" },
    ],
  },
];

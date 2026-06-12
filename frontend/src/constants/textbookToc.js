// AI Textbook nested table of contents.
// Each chapter has subsections. Structure only — content is added later.
export const TEXTBOOK_TOC = [
  {
    key: "foundations",
    label: "Mathematics & Foundations",
    sections: [
      { key: "linear-algebra", label: "Linear Algebra" },
      { key: "probability", label: "Probability & Statistics" },
      { key: "calculus", label: "Calculus" },
      { key: "information-theory", label: "Information Theory" },
      { key: "optimization-basics", label: "Optimization Basics" },
    ],
  },
  {
    key: "data-science",
    label: "Data Science",
    sections: [
      { key: "data-wrangling", label: "Data Wrangling" },
      { key: "eda", label: "Exploratory Analysis" },
      { key: "feature-engineering", label: "Feature Engineering" },
      { key: "data-pipelines", label: "Data Pipelines" },
    ],
  },
  {
    key: "machine-learning",
    label: "Machine Learning",
    sections: [
      { key: "supervised", label: "Supervised Learning" },
      { key: "unsupervised", label: "Unsupervised Learning" },
      { key: "model-evaluation", label: "Model Evaluation" },
      { key: "regularization", label: "Regularization" },
      { key: "ensembles", label: "Ensembles" },
    ],
  },
  {
    key: "deep-learning",
    label: "Deep Learning",
    sections: [
      { key: "neural-networks", label: "Neural Networks" },
      { key: "backpropagation", label: "Backpropagation" },
      { key: "cnn", label: "Convolutional Networks" },
      { key: "rnn", label: "Recurrent Networks & LSTMs" },
      { key: "transformers", label: "Transformers" },
      { key: "diffusion", label: "Diffusion Models" },
      { key: "generative", label: "Generative Models" },
    ],
  },
  {
    key: "computer-vision",
    label: "Computer Vision",
    sections: [
      { key: "image-classification", label: "Image Classification" },
      { key: "object-detection", label: "Object Detection" },
      { key: "segmentation", label: "Segmentation" },
      { key: "3d-vision", label: "3D Vision" },
      { key: "vision-language", label: "Vision-Language Models" },
    ],
  },
  {
    key: "nlp",
    label: "Natural Language Processing",
    sections: [
      { key: "embeddings", label: "Embeddings" },
      { key: "sequence-models", label: "Sequence Models" },
      { key: "llms", label: "Large Language Models" },
      { key: "retrieval", label: "Retrieval & RAG" },
    ],
  },
  {
    key: "reinforcement-learning",
    label: "Reinforcement Learning",
    sections: [
      { key: "mdp", label: "Markov Decision Processes" },
      { key: "q-learning", label: "Q-Learning" },
      { key: "policy-gradients", label: "Policy Gradients" },
      { key: "actor-critic", label: "Actor-Critic" },
      { key: "multi-agent-rl", label: "Multi-Agent RL" },
    ],
  },
  {
    key: "physical-ai",
    label: "Physical AI",
    sections: [
      { key: "robotics-foundations", label: "Robotics Foundations" },
      { key: "sensorimotor", label: "Sensorimotor Learning" },
      { key: "world-models", label: "World Models" },
      { key: "sim-to-real", label: "Sim-to-Real" },
      { key: "manipulation", label: "Manipulation" },
    ],
  },
  {
    key: "multi-agent-systems",
    label: "Multi-Agent Systems",
    sections: [
      { key: "coordination", label: "Coordination" },
      { key: "consensus", label: "Consensus Algorithms" },
      { key: "game-theory", label: "Game Theory" },
      { key: "swarms", label: "Swarm Intelligence" },
    ],
  },
  {
    key: "edge-ai",
    label: "Edge AI",
    sections: [
      { key: "quantization", label: "Quantization" },
      { key: "pruning", label: "Pruning & Distillation" },
      { key: "hardware-accel", label: "Hardware Accelerators" },
      { key: "deployment", label: "Edge Deployment" },
    ],
  },
  {
    key: "trustworthy-ai",
    label: "Trustworthy AI",
    sections: [
      { key: "explainability", label: "Explainability" },
      { key: "calibration", label: "Calibration" },
      { key: "robustness", label: "Robustness" },
      { key: "safety", label: "Safety & Alignment" },
      { key: "fairness", label: "Fairness" },
    ],
  },
  {
    key: "systems",
    label: "ML Systems & MLOps",
    sections: [
      { key: "training-infra", label: "Training Infrastructure" },
      { key: "serving", label: "Model Serving" },
      { key: "monitoring", label: "Monitoring & Drift" },
      { key: "versioning", label: "Data & Model Versioning" },
    ],
  },
];

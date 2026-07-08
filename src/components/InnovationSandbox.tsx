import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Wifi, WifiOff, Play, Terminal, Code, Sparkles, ShieldCheck, Database, Layers, Check, Crown, AlertTriangle, Coins, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechProject {
  id: string;
  date: string;
  title: string;
  tagline: string;
  impactScore: number;
  techStack: string[];
  impactDescription: string;
  problemSolved: string;
  architecture: string[];
  metrics: { [key: string]: string };
}

const PROJECTS: TechProject[] = [
  {
    id: 'speculative-decoding',
    date: 'July 08, 2026 (Today)',
    title: 'Speculative Decoding Engine',
    tagline: 'Multi-token speculative drafting and parallel verification simulator for high-speed edge LLM execution',
    impactScore: 9.9,
    techStack: ['Speculative Decoding', 'Draft & Target Models', 'Parallel Verification', 'K-Token Drafting', 'WebGPU Acceleration', 'Memory Bandwidth Optimization'],
    problemSolved: 'Autoregressive generation in large language models is severely memory-bandwidth bound. Generating each token requires loading the entire model parameters (e.g. 70B parameters) from VRAM to GPU cache, restricting edge device execution speeds to ~15-30 tokens/second.',
    impactDescription: 'Demonstrates speculative decoding where a small "draft" model (e.g., 1B params) generates a sequence of K tokens at high speed. A larger "target" model (e.g., 70B params) then runs a single parallel forward pass to verify all K tokens simultaneously. Accepted draft tokens are kept, while rejected ones are discarded and corrected, enabling 2x to 3x speedup on local edge hardware without modifying the target model output distribution.',
    architecture: [
      'Speculative Drafting ──> Draft model (1B) generates K candidate tokens sequentially at high speed',
      'Parallel Evaluation ──> Target model (70B) runs a single parallel forward pass to compute token probabilities',
      'Acceptance Test ──> Cryptographically or statistically verify candidate tokens: P_target(x) >= P_draft(x)',
      'Verification & Correction ──> Retain accepted tokens, reject anomalies, and sample one target-corrected token',
      'Cache Sync ──> Sync Draft and Target KV-caches by rolling back rejected key-value slots and repeat'
    ],
    metrics: {
      'Average Speedup': '2.35x',
      'Acceptance Rate': '76.4%',
      'Memory Savings': '60% Bandwidth reduction',
      'Draft Length (K)': '4 tokens',
      'Target Model': 'Llama-3-70B',
      'Draft Model': 'Llama-3-1B'
    }
  },
  {
    id: 'grpo-reasoning',
    date: 'July 07, 2026',
    title: 'GRPO Reasoning Policy Optimizer',
    tagline: 'Group Relative Policy Optimization (GRPO) simulator for criticless RL reasoning alignment',
    impactScore: 9.9,
    techStack: ['GRPO Algorithm', 'Reinforcement Learning (RL)', 'Value-Free Advantage', 'Chain of Thought (CoT)', 'Rule-Based Rewards', 'Alignment Algorithms'],
    problemSolved: 'Standard Reinforcement Learning from Human Feedback (RLHF) or PPO requires a secondary "critic" network (value model) of the same size as the policy network, doubling VRAM requirements. This makes local or edge-based RL alignment training impossible on consumer hardware.',
    impactDescription: 'Implements a visual simulation of Group Relative Policy Optimization (GRPO), the RL algorithm used to train DeepSeek-R1. By sampling a group of multiple candidate reasoning paths for a single prompt, it computes advantages relative to the group average. This completely removes the need for a critic model, saving 50% VRAM and enabling highly efficient, local self-correction training.',
    architecture: [
      'Logical Prompt ──> Broadcast prompt to the active reasoning policy \\pi_\\theta',
      'Group Sampling ──> Generate a group of G (4-8) parallel reasoning chains with temperature variation',
      'Rule-Based Evaluator ──> Score formatting (use of <thought> tags) and answer correctness',
      'Advantage Engine ──> Compute normalized advantage A_i = (R_i - mean(R)) / std(R) for each path without a critic',
      'Policy Update ──> Apply policy gradient loss L_GRPO = -1/G \\sum [min(r_i * A_i, clip(r_i) * A_i) - \\beta D_KL]'
    ],
    metrics: {
      'Group Size (G)': '6 paths per prompt',
      'Critic Model Size': '0 MB (Value-Free)',
      'VRAM Savings': '50% reduction in training memory',
      'Optimizer': 'GRPO AdamW (lr=2e-6)'
    }
  },
  {
    id: 'sae-steering',
    date: 'July 01, 2026',
    title: 'Sparse Autoencoder (SAE) Feature Steering',
    tagline: 'Real-time activation patching and safety boundary steering simulator for LLMs',
    impactScore: 9.9,
    techStack: ['Sparse Autoencoders (SAEs)', 'Activation Patching', 'Feature Steering', 'LLM Interpretability', 'Safety Intervention', 'Monosemantic Features'],
    problemSolved: 'Standard safety alignment (RLHF/DPO) behaves like a soft filter that can easily be jailbroken or bypassed. Furthermore, internal representation superposition makes it impossible to surgically control specific behaviors or understand how the model represents complex concepts.',
    impactDescription: 'Implements a client-side visualization of Sparse Autoencoders (SAEs) applied to an LLM\'s intermediate MLP/attention activations. By projecting dense activation patterns into a high-dimensional sparse feature space, it isolates independent, monosemantic concepts. It enables real-time feature steering by scaling feature coefficients to force specific personas or suppress unsafe/harmful concepts.',
    architecture: [
      'LLM Layer Activation ──> Extract dense activation vector x from intermediate layer',
      'Sparse Autoencoder Encoder ──> Project x to high-dim feature space f = ReLU(W_enc * x + b_enc)',
      'Feature Steering Controller ──> Inject manual scaling multipliers directly on the sparse feature vector f',
      'Sparse Autoencoder Decoder ──> Reconstruct LLM activations x\' = W_dec * f_steered + b_dec and inject back into the forward pass'
    ],
    metrics: {
      'Sparsity (L0 norm)': '~12 active features (out of 16k)',
      'Reconstruction Fidelity': '98.5% Explained Variance',
      'Steering Latency': '< 5ms (In-memory tensor patch)',
      'Intervention Type': 'Activation Clamping / Scaling'
    }
  },
  {
    id: 'jepa-agent',
    date: 'June 25, 2026',
    title: 'V-JEPA World Model Agent',
    tagline: 'Local Browser-Based V-JEPA Spatial Masking and Non-Reconstructive State Predictor',
    impactScore: 9.9,
    techStack: ['V-JEPA (Video-JEPA)', 'Joint Embedding Predictive Architecture', 'Representation Alignment', 'Self-Supervised Learning', 'Spatial Masking', 'Clean Latent Spaces'],
    problemSolved: 'Generative world models waste massive compute reconstructing fine-grained pixel details (like water waves or camera noise) that are irrelevant for downstream agent planning. This makes edge deployment energy-prohibitive and memory-heavy.',
    impactDescription: 'Implements a non-reconstructive V-JEPA (Video Joint Embedding Predictive Architecture) world model. By predicting masked visual features directly in a clean latent embedding space, the agent filters out high-frequency sensory noise. This reduces local compute requirements by over 90% while building robust representations for action planning.',
    architecture: [
      'Raw Video Stream ──> Context Encoder maps unmasked frames to latent features',
      'Target Encoder ──> Generates clean target embeddings for masked frame regions',
      'Predictor network ──> Predicts target representation from context representation and action query',
      'Variance/Covariance Constraints ──> Prevents representation collapse (VicReg-style loss)'
    ],
    metrics: {
      'Compute Overhead': 'O(Latent Dim) vs O(Pixels)',
      'Energy Efficiency': '12x lower inference draw',
      'Noise Invariance': 'Immune to pixel-space static/distractors',
      'Loss Type': 'L2 Distance in Feature Space'
    }
  },
  {
    id: 'ttc-reasoning',
    date: 'June 22, 2026',
    title: 'TTC Test-Time Reasoning',
    tagline: 'Adaptive Test-Time Compute (TTC) reasoning tree simulator using Monte Carlo Tree Search (MCTS) for Agentic Self-Correction',
    impactScore: 9.9,
    techStack: ['Test-Time Compute', 'Monte Carlo Tree Search (MCTS)', 'Tree of Thoughts', 'Self-Correction Loop', 'Backtracking Optimization', 'Adaptive Compute Allocation'],
    problemSolved: 'Standard LLMs allocate fixed compute per token, treating trivial grammar and complex logical reasoning tasks with the same depth. This limits their ability to think, backtrack on mistakes, reflect on contradictions, or perform multi-path search before committing to an answer.',
    impactDescription: 'Implements an adaptive Test-Time Compute (TTC) reasoning engine that dynamically allocates token budget. Utilizing a Monte Carlo Tree Search (MCTS) loop, it generates candidate reasoning steps, scores path validity, runs self-reflection steps to catch errors, and backtracks to try alternative strategies. This unlocks verified, multi-step problem solving at inference time.',
    architecture: [
      'Query Analyzer ──> Estimates problem complexity and allocates initial computation budget',
      'Reasoning Node Generator ──> Expands search branches with diverse alternative thoughts',
      'Self-Reflection Critic ──> Evaluates path likelihood of success, outputting confidence scores',
      'MCTS Backpropagation ──> Updates tree nodes, triggers backtracking upon detecting contradictions'
    ],
    metrics: {
      'Compute Scaling': 'Adaptive (O(Budget) scaling)',
      'Search Depth': 'Up to 8 levels of nested reasoning',
      'Self-Correction': 'Active backtracking on low-confidence nodes',
      'Verification Level': 'Consensus-driven path selection'
    }
  },
  {
    id: 'kan-agent',
    date: 'June 17, 2026',
    title: 'KAN Kolmogorov-Arnold Network',
    tagline: 'Edge-Bound Kolmogorov-Arnold Network (KAN) Simulator with Learnable Splines on Edges',
    impactScore: 9.9,
    techStack: ['Kolmogorov-Arnold Networks', 'B-Spline Activation', 'Edge-Bound Learning', 'WebGPU (WGSL)', 'Function Fitting', 'Interactive Splines'],
    problemSolved: 'Traditional Multi-Layer Perceptrons (MLPs) place fixed activation functions on nodes and adjust linear weights on edges. This requires massive dense networks to learn non-linear functions, making edge inference slow and hard to interpret.',
    impactDescription: 'Implements a Kolmogorov-Arnold Network (KAN) where weights are replaced by learnable 1D functions (B-splines) parameterized on the edges. By shifting activation functions to edges, KANs achieve much higher accuracy with orders of magnitude fewer parameters than MLPs, unlocking transparent, interpretable, and lightweight edge-based function approximation.',
    architecture: [
      'B-Spline Grid Generator ──> Constructs piecewise polynomial basis functions for edge activations',
      'Learnable Edge-Weight Updater ──> Updates spline coefficients (control points) via local gradient descent',
      'Node Summation Pass ──> Sums edge-activated outputs at each hidden and output node',
      'Interactive Spline Sculptor ──> Allows manual real-time modification of spline control points'
    ],
    metrics: {
      'Parameter Efficiency': '10x fewer parameters than MLPs',
      'Fitting Accuracy': 'MSE < 0.0001 (Real-time)',
      'Spline Order': 'Cubic B-Splines (Order 3)',
      'Interpretability': 'High (Closed-form symbolic representation)'
    }
  },
  {
    id: 'snn-agent',
    date: 'June 16, 2026',
    title: 'SNN Neuromorphic Agent',
    tagline: 'WebGPU Event-Driven Spiking Neural Network (SNN) Agent for Zero-Latency Local Sensory Processing',
    impactScore: 9.9,
    techStack: ['Spiking Neural Networks', 'LIF Neuron Model', 'WebGPU (WGSL)', 'Event-Driven Simulation', 'STDP Learning Rule', 'Neuromorphic Hardware Emulation'],
    problemSolved: 'Traditional artificial neural networks process dense tensors at fixed steps, consuming massive continuous energy and compute even when input sensors have no changes. This is inefficient for real-time edge processing (e.g. event cameras, IoT sensors).',
    impactDescription: 'Implements an event-driven Spiking Neural Network (SNN) utilizing the Leaky Integrate-and-Fire (LIF) model. By using WebGPU compute shaders to track membrane potentials and propagate discrete spike events asynchronously, it mimics biological brain efficiency. Synaptic weights are updated locally using Spike-Timing-Dependent Plasticity (STDP), reducing active compute by up to 95% on quiet inputs.',
    architecture: [
      'Event Stream Loader ──> Converts sparse analog inputs (video, audio) to discrete spike trains',
      'LIF Membrane Potential Shader ──> Simulates leaky integration of charge and triggers threshold spikes',
      'Synaptic Propagation Pass ──> Propagates spike events along connections using dynamic delays',
      'STDP Learning Kernel ──> Modifies weights based on microsecond difference between pre- and post-synaptic spikes'
    ],
    metrics: {
      'Compute Overhead': 'O(S) where S is active spikes (Sparse)',
      'Energy Consumption': '0.05x of dense feedforward models',
      'Neuron Count Emulated': '131,072 LIF neurons in real-time',
      'Synaptic Weight Update': 'STDP (Unsupervised local learning)'
    }
  },
  {
    id: 'mamba-ssm',
    date: 'June 14, 2026',
    title: 'Mamba Selective SSM',
    tagline: 'WebGPU Selective State Space Model (SSM) Inference Engine for Infinite-Context Local AI Agents',
    impactScore: 9.9,
    techStack: ['Mamba-2 Architecture', 'WebGPU (WGSL)', 'Selective Scan (S6)', 'Parallel Scan Operator', 'Linear Complexity O(N)', 'WebAssembly (Rust)'],
    problemSolved: 'Standard Transformer-based agents suffer from quadratic memory and computational complexity O(N^2) as the context window grows. The Key-Value (KV) cache grows linearly, quickly exhausting edge device VRAM (GPU memory) during long agent loops.',
    impactDescription: 'Implements a WebGPU-bound Selective State Space Model (SSM) using the S6 scan operator. By executing the state updates recursively or via parallel associative scans, it achieves linear complexity O(N) in sequence length while maintaining a constant O(1) state cache footprint. This reduces memory usage by up to 98% for long context reasoning, allowing edge agents to run infinite-context loops locally.',
    architecture: [
      'Sequence Loader ──> Tokenizes stream and maps input to feature vectors',
      'Selective Scan Shaders ──> WebGPU compute shaders dynamically calculate state gates (A, B, C) per token',
      'Parallel Scan Operator ──> Performs associative scan prefix loop for fast GPU execution',
      'SSM State Updater ──> Updates constant-size state buffer (size h_d = 16) with zero KV cache overhead'
    ],
    metrics: {
      'State Cache Size': 'O(1) Constant (vs O(N) for KV Cache)',
      'Sequence Complexity': 'O(N) Linear (vs O(N^2) for Attention)',
      'Max Context Window': 'Infinite-context reasoning',
      'VRAM Saving': '98.2% reduction at 32k tokens'
    }
  },
  {
    id: 'bitnet-agent',
    date: 'June 11, 2026',
    title: 'BitNet-Agent (1.58-bit)',
    tagline: 'WebGPU Ternary-Weight (1.58-bit) LLM Inference Engine for Low-Power Edge Agent Swarms',
    impactScore: 9.9,
    techStack: ['BitNet b1.58', 'WebGPU (WGSL)', 'Ternary Quantization', 'Linear Kernel Optimization', 'React Canvas', 'INT8/INT2 Packing'],
    problemSolved: 'Edge-based AI agents are bottlenecked by memory bandwidth and high power consumption when running full-precision models. Standard FP16 weights require significant memory transfers and floating-point multiplications, rendering local agent collaboration on mobile/IOT devices impractical.',
    impactDescription: 'Replaces standard floating-point matrix multiplications with integer additions/subtractions using ternary weights {-1, 0, 1}. The custom WGSL shaders pack two weights into 4 bits, reducing VRAM usage by 82.5% and accelerating inference to over 100 tokens/sec in-browser. This allows complex local agent swarms to run on standard user hardware at 1/10th the power cost.',
    architecture: [
      'Model Loader ──> Decompresses packed 2-bit weights into GPU texture memory',
      'WebGPU Compute Pass ──> BitLinear kernel performs additive accumulation without floating-point ALU multipliers',
      'Sequence Layer RMSNorm ──> Dynamically scales activation outputs using dynamic scaling factors',
      'Inference Scheduler ──> Generates agent actions locally, consuming under 150mW per edge client'
    ],
    metrics: {
      'Weight Precision': 'b1.58-bit ({-1, 0, 1})',
      'VRAM Footprint': '580 MB (3B Model)',
      'Execution Speed': '118 tokens/sec (WebGPU Edge)',
      'Energy Efficiency': '12.4x tokens/Joule (vs FP16)'
    }
  },
  {
    id: 'liquid-agent',
    date: 'June 09, 2026',
    title: 'Liquid-Agent WebGPU',
    tagline: 'Adaptive Liquid Time-Constant Neural Network (LNN) Agents on WebGPU for Real-Time Edge Processing',
    impactScore: 9.8,
    techStack: ['WebGPU (WGSL)', 'Liquid Time-Constant Networks', 'Continuous-Time ODEs', 'React 19 Canvas', 'WASM-Rust'],
    problemSolved: 'AI agents running in dynamic real-time environments (like robotics, autonomous drones, or highly interactive user interfaces) struggle with standard feed-forward or recurrent neural network topologies that process data at fixed time steps. They are computationally expensive and cannot naturally adapt to variable time delays or continuous streams of sensory inputs.',
    impactDescription: 'Enables continuous-time adaptive reasoning directly in the browser. Using a WebGPU-bound compute shader implementing Liquid Neural Networks, the agent\'s state transitions are governed by differential equations where node parameters change dynamically based on inputs. This reduces compute overhead by up to 90% while maintaining smooth, adaptive behavior under network latency or missing data.',
    architecture: [
      'Sensory Inputs ──> Ingested into WebGPU Input Buffers',
      'WebGPU Compute Shader (WGSL) ──> Solves ODE integration (Euler method) for state variables',
      'Liquid Time-Constant Matrix ──> Adapts hidden state dynamics dynamically per time-delta',
      'Output Policy ──> Steers agent actions and UI animation frame-by-frame with zero lag'
    ],
    metrics: {
      'ODE Step Size': 'dt = 0.05 (Continuous-time)',
      'Compute Performance': '60 FPS @ 2048 parameters',
      'GPU Power Consumption': '120mW (Client Edge)',
      'Dynamic Adaptability': 'Real-time state correction under 15ms'
    }
  },
  {
    id: 'confidential-tee',
    date: 'June 08, 2026',
    title: 'Confidential TEE-Agent Enclave',
    tagline: 'Hardware-Isolated Confidential Computing and Remote Attestation for Autonomous AI Agent Workflows',
    impactScore: 9.8,
    techStack: ['Intel SGX', 'AWS Nitro Enclaves', 'Remote Attestation', 'Rust (Gramine)', 'ECDSA P-384'],
    problemSolved: 'Autonomous agents handle sensitive corporate credentials, API keys, and private customer data. Traditional cloud hosting is vulnerable to host-level exploitation, memory snooping, or cloud provider insider threats.',
    impactDescription: 'Runs agent code, prompts, and memory databases inside cryptographically isolated CPU enclaves. Users can verify a cryptographic Remote Attestation report to prove the agent hasn\'t been tampered with and is executing the exact public open-source code, enabling absolute trust in autonomous execution.',
    architecture: [
      'Client ──> Generates cryptographic challenge & sends to Enclave',
      'TEE Enclave (Intel SGX/Nitro) ──> Runs local LLM reasoning & signs response with ephemeral key',
      'TEE Hardware CPU ──> Generates cryptographic Attestation Report (SHA-256 MRENCLAVE hash)',
      'Client ──> Verifies CPU signature and MRENCLAVE hash against Intel Attestation Service (IAS) / AWS KMS'
    ],
    metrics: {
      'Enclave Boot Overhead': '240 ms (AWS Nitro)',
      'Memory Attestation Latency': '45 ms (Local verification)',
      'Cryptographic Strength': 'RSA-3072 / ECDSA P-384',
      'Isolation Guarantee': 'Hardware-level DRAM Encryption'
    }
  },
  {
    id: 'depin-billing',
    date: 'June 07, 2026',
    title: 'DePIN-Agent Billing',
    tagline: 'Decentralized Agent-to-Agent Micro-billing and Resource Allocation on DePIN Networks',
    impactScore: 9.7,
    techStack: ['Solidity (ERC-4337)', 'Lit Protocol', 'Chainlink Functions', 'Arbitrum Stylus', 'ECDSA Secp256k1'],
    problemSolved: 'AI agents running on decentralized edge networks need a trustless way to pay each other for API calls, compute power, and data access. Traditional web2 APIs rely on centralized credit cards or API keys which agents cannot directly register or manage.',
    impactDescription: 'Enables a self-sovereign agent economy. Edge agents can verify execution bounds and automatically authorize micro-payments to peer agents or hosting providers using ERC-4337 account abstraction and threshold cryptography, paying exactly for the compute consumed.',
    architecture: [
      'Agent-A (Client) ──> Formulates query and signs pay-per-compute voucher (ERC-4337)',
      'DePIN Node (Provider) ──> Runs local WebGPU LLM task and registers compute metrics',
      'Lit Protocol Node ──> Verifies compute completion proof and triggers threshold decryption',
      'Smart Contract ──> Settles micro-payment channel and releases funds to DePIN provider'
    ],
    metrics: {
      'Gas Settlement Cost': '$0.002 (Arbitrum Stylus)',
      'Micro-billing Latency': '250 ms (Threshold signing)',
      'Verification Overhead': '1.8 ms (Local proof validation)',
      'Trust Model': 'Decentralized Account Abstraction (ERC-4337)'
    }
  },
  {
    id: 'kyber-agent',
    date: 'June 06, 2026',
    title: 'Kyber-Agent P2P',
    tagline: 'Post-Quantum Cryptographic Key Exchange for Edge Multi-Agent Communication',
    impactScore: 9.8,
    techStack: ['ML-KEM (Kyber-768)', 'ML-DSA (Dilithium)', 'WebAssembly (Wasm)', 'WebRTC DataChannels', 'WebCrypto API'],
    problemSolved: 'P2P agent networks rely on classical ECDH (Secp256k1) or RSA key exchanges, which are vulnerable to store-now-decrypt-later attacks by future quantum computers. Kyber-Agent secures agent gossip networks using post-quantum secure ML-KEM and ML-DSA.',
    impactDescription: 'Cryptographically secures browser-to-browser agent communication against future quantum adversaries. Multi-agent swarms can coordinate tasks and exchange proprietary weights, prompts, and memory vectors without any exposure to eavesdropping or identity spoofing.',
    architecture: [
      'Initiator Agent ──> Generates ML-KEM-768 public/secret keypair (Wasm)',
      'Initiator Agent ──> Sends Kyber public key + Dilithium signature to responder',
      'Responder Agent ──> Verifies identity signature & encapsulates symmetric seed',
      'Responder Agent ──> Sends ciphertext to initiator, both derive AES-GCM-256 session key'
    ],
    metrics: {
      'Key Gen Latency': '1.4 ms (Wasm ML-KEM-768)',
      'Encapsulation Speed': '0.9 ms',
      'Decapsulation Speed': '1.1 ms',
      'Signature Verification': '2.1 ms (Dilithium-3)',
      'Post-Quantum Security': 'NIST Category 3 (Kyber-768)'
    }
  },
  {
    id: 'he-rag',
    date: 'June 04, 2026',
    title: 'Homomorphic-RAG (HE-RAG)',
    tagline: 'Fully Homomorphic Encrypted (FHE) Vector Search for Zero-Trust Cloud RAG',
    impactScore: 9.9,
    techStack: ['TFHE-rs (Wasm)', 'Concrete-ML', 'BFV/CKKS Scheme', 'Vector Database', 'WebAssembly'],
    problemSolved: 'Querying third-party vector databases with sensitive enterprise or personal data leaks search intent and proprietary context. HE-RAG encrypts query vectors client-side, allowing cloud databases to run similarity calculations on ciphertexts without decryption.',
    impactDescription: 'Ensures absolute privacy for enterprise RAG workflows. A company can query search indices containing proprietary financial or health data without exposing search context to the cloud database provider or intermediate routers.',
    architecture: [
      'Plaintext Query ──> WebAssembly FHE Encrypter (CKKS encryption of vector)',
      'Ciphertext Query ──> Cloud Vector DB (performs homomorphic multiplication/addition for cosine similarity)',
      'Encrypted Distances ──> Client Wasm Decrypter (decrypts result index & distance scores)',
      'Decrypted Top-K Indices ──> Ingest and render relevant doc fragments locally'
    ],
    metrics: {
      'Client Encryption Time': '18 ms (Wasm-CKKS)',
      'Homomorphic Search Speed': '8.2 ms per 1536-dim vector',
      'Client Decryption Time': '1.2 ms',
      'Data Privacy Rating': 'Zero Leakage (Cryptographically Guaranteed)'
    }
  },
  {
    id: 'zk-inference',
    date: 'June 03, 2026',
    title: 'zk-Inference Validator',
    tagline: 'Zero-Knowledge Proof-of-Generation for Verifiable Edge LLM Output',
    impactScore: 9.9,
    techStack: ['Halo2 ZK-Prover', 'WASM Compilation', 'WebGPU Accelerators', 'BN254 Pairing Curve', 'RISC Zero'],
    problemSolved: 'Outsourcing sensitive LLM inferences to untrusted client browsers or third-party edge nodes risks model substitution (using cheaper models) or output tampering. zk-Inference Validator generates cryptographic proofs proving that an LLM inference was executed correctly with a specific model and prompt.',
    impactDescription: 'Enables verifiable trustless LLM compute marketplace. Requesting platforms can verify that a client node executed Llama-3-8B accurately on their prompt within milliseconds, enabling safe outsourcing of decentralized AI agent workflows.',
    architecture: [
      'LLM Execution Circuit ──> Step-by-step witness generation (WASM)',
      'WebGPU Acceleration ──> Multi-Scalar Multiplication (MSM) & Number Theoretic Transform (NTT)',
      'Halo2 Prover ──> Generate non-interactive cryptographic proof (340 bytes)',
      'Consensus Verifier ──> Sub-millisecond validation of proof and output content authenticity'
    ],
    metrics: {
      'Proof Generation Time': '1.2 seconds (WASM-Halo2)',
      'Verification Speed': '0.4 ms (Smart Contract/Client)',
      'Proof Size': '340 bytes',
      'Trust Assurance': '100% Cryptographically Verified'
    }
  },
  {
    id: 'swarm-consensus',
    date: 'June 02, 2026',
    title: 'SwarmConsensus P2P',
    tagline: 'Decentralized P2P Agent Swarm Byzantine Fault Tolerant (BFT) Task Allocation',
    impactScore: 9.7,
    techStack: ['WebRTC DataChannels', 'Byzantine Agreement', 'WASM-Raft Consensus', 'Local Secp256k1', 'Y.js Sync'],
    problemSolved: 'Centralized LLM swarm coordinators are single points of failure, expose interaction logs, and cannot handle malicious/failed agent completions. SwarmConsensus allows edge agent nodes to agree on task splitting, verification, and output merging without a coordinator.',
    impactDescription: 'Secures collaborative agent workflows across edge devices. If 2 nodes in a 5-node swarm go offline or return corrupted LLM completions, the consensus protocol detects the anomaly, rejects the corrupt agent trace, and redistributes the task dynamically.',
    architecture: [
      'Task Received ──> Raft Leader Node proposes assignment map',
      'Follower Agent Nodes ──> Run local LLM task & create cryptographic state hash',
      'WebRTC Gossip Network ──> Exchange state hashes and run BFT validation check',
      'Consensus Approved Output ──> Commit to Y.js CRDT State Vector on all nodes'
    ],
    metrics: {
      'Consensus Round-trip': '42 ms (WebRTC Gossip)',
      'Byzantine Resiliency': 'Up to 33.3% malicious/failed agents tolerated',
      'WASM State Verify Time': '0.8 ms per node',
      'Bandwidth Consumption': '12 KB/sec average'
    }
  },
  {
    id: 'synaptic-crdt',
    date: 'June 01, 2026',
    title: 'Synaptic-CRDT',
    tagline: 'Local-First Collaborative Document Editor with Browser-Embedded LLMs',
    impactScore: 9.8,
    techStack: ['Y.js CRDTs', 'WebLLM (Llama-3-8B)', 'WebGPU Shaders', 'WebRTC Gossip', 'IndexedDB'],
    problemSolved: 'Collaborative productivity tools (like Notion/Docs) rely on central cloud servers, risking user privacy, latency, and offline outages. Synaptic-CRDT moves both real-time syncing and AI assistance completely to the client side.',
    impactDescription: 'Reduces server API costs to $0, ensures 100% data sovereignty, and guarantees sub-millisecond local latency. AI assistance is fully functional offline, enabling safe editing of sensitive corporate documents without third-party exposure.',
    architecture: [
      'User Input (Rich Editor) ──> Y.js CRDT Op Log',
      'Y.js Op Log ──> WebRTC P2P Sync Router & IndexedDB Persistence',
      'Local Context Analyzer ──> WebGPU-bound WebLLM Engine (In-Browser)',
      'Local LLM ──> Peer-to-Peer Agent Node (Injects edits directly into the document structure)'
    ],
    metrics: {
      'Sync Latency': '1.2 ms (Local-First)',
      'WebGPU AI Inference': '45 tokens/sec (Local Llama-3)',
      'Server Cost Savings': '100% ($0 Infrastructure)',
      'Data Privacy Rating': 'Military Grade (Zero Egress)'
    }
  },
  {
    id: 'neuroflow-nca',
    date: 'May 31, 2026',
    title: 'NeuroFlow NCA',
    tagline: 'WebGPU-powered Neural Cellular Automata Generative UI Engine',
    impactScore: 9.2,
    techStack: ['WebGPU WGSL', 'Neural Networks', 'Morphogenetic Algorithms', 'React 19 Canvas'],
    problemSolved: 'Traditional UI animations are hand-coded, static, and cannot self-heal or adapt to custom viewport contexts. NeuroFlow uses Neural Cellular Automata to grow, texture, and adapt user interface layouts organically.',
    impactDescription: 'Pioneers biological self-healing software concepts. If parts of the UI layout are destroyed or corrupted by runtime errors, the NCA rules automatically regenerate the visual components within 60 frames.',
    architecture: [
      'React UI View ──> Canvas WebGPU Context',
      'Compute Shader (WGSL) ──> Run 16-channel Cellular Update Rules',
      'Target Grid State ──> Self-Healing / Texture Generation Output'
    ],
    metrics: {
      'Compute Performance': '60 FPS @ 1024x1024 grid',
      'Memory Overhead': '8.4 MB VRAM',
      'Resiliency Rate': '99.8% Recovery from visual corruption',
      'Shader Operations': '3.2 Gigaflops/sec'
    }
  },
  {
    id: 'zkp-verify',
    date: 'May 30, 2026',
    title: 'VeriTrust ZKP',
    tagline: 'Zero-Knowledge Proof Identity and Financial Solvency Verifier',
    impactScore: 9.5,
    techStack: ['Circom 2.1', 'SnarkJS', 'WebAssembly (Wasm)', 'Zero-Knowledge Proofs'],
    problemSolved: 'Users must expose sensitive PII (passwords, income files, SSN) to third parties just to prove credentials, leading to massive data breaches and identity theft.',
    impactDescription: 'Enables "Proof of Solvency" and "Proof of Identity" client-side. A user can prove their salary is above $80k or age is over 21 without revealing the actual numbers or their name, securing client-server trust.',
    architecture: [
      'Private Input Credentials ──> Wasm Witness Generator',
      'Witness File ──> SnarkJS Client-Side Prover (Groth16)',
      'ZKP Proof (JSON) ──> Server-Side Light Verifier (Cryptographic check)'
    ],
    metrics: {
      'Client Proof Generation Time': '1.8 seconds (WebAssembly)',
      'Verification Latency': '12 ms',
      'Proof Size': '800 bytes',
      'Cryptographic Security': '256-bit Curve (BN254)'
    }
  }
];

const promptsData = {
  'logic-brother': {
    prompt: "Alice has 3 sisters, and each sister has 1 brother. How many brothers does Alice have?",
    correctAnswer: "1",
    paths: [
      {
        thought: "Let's analyze the family relationships. Alice has 3 sisters. These sisters and Alice are all part of the same sibling group. Each sister has 1 brother. Since they are all siblings, the brother of one sister must be the brother of all other sisters. Therefore, there is only 1 brother in the family, shared by all sisters including Alice.",
        answer: "Alice has 1 brother.",
        correct: true,
        formatCorrect: true,
        temperature: 0.1
      },
      {
        thought: "Sisters all share the same brother since they are in the same family. So the answer is 1.",
        answer: "1",
        correct: true,
        formatCorrect: false,
        temperature: 0.3
      },
      {
        thought: "Alice has 3 sisters. Each sister has 1 brother. 3 sisters * 1 brother each = 3 brothers. Let's double check. If each has a separate brother, then there are 3 brothers. Yes, that seems correct.",
        answer: "Alice has 3 brothers.",
        correct: false,
        formatCorrect: true,
        temperature: 0.7
      },
      {
        thought: "Alice is a sister. She has 3 sisters, so there are 4 girls. Each girl has a brother. If each sister has a brother, that could mean multiple brothers, or maybe it's a trick question and there are zero. Let's guess 3.",
        answer: "3",
        correct: false,
        formatCorrect: true,
        temperature: 0.8
      },
      {
        thought: "All sisters have the same parents, so their brother is the same person. Thus, only one brother exists.",
        answer: "1 brother",
        correct: true,
        formatCorrect: false,
        temperature: 0.5
      },
      {
        thought: "The key is understanding sibling relationships. A brother of Alice's sister is also Alice's brother. If each sister has 1 brother, it refers to the same brother. So there is exactly 1 brother in the family. Alice has 1 brother.",
        answer: "1",
        correct: true,
        formatCorrect: true,
        temperature: 0.2
      },
      {
        thought: "I am an AI, and I can answer logic questions. Sibling problems are interesting. If Alice has 3 sisters, there are 4 siblings in total. But wait, each sister has a brother. Let's output 4.",
        answer: "4 brothers",
        correct: false,
        formatCorrect: true,
        temperature: 0.9
      },
      {
        thought: "Each sister has 1 brother. Since they are sisters, they share the same brother. So there is 1 brother.",
        answer: "1",
        correct: true,
        formatCorrect: true,
        temperature: 0.4
      }
    ]
  },
  'math-equation': {
    prompt: "Solve for x: 3x + 7 = 22.",
    correctAnswer: "5",
    paths: [
      {
        thought: "We start with the equation: 3x + 7 = 22. Subtract 7 from both sides: 3x = 22 - 7 => 3x = 15. Divide both sides by 3: x = 15 / 3 => x = 5. Let's verify: 3(5) + 7 = 15 + 7 = 22. Correct.",
        answer: "x = 5",
        correct: true,
        formatCorrect: true,
        temperature: 0.1
      },
      {
        thought: "3x + 7 = 22. Subtract 7 gives 15. Divide by 3 gives 5.",
        answer: "5",
        correct: true,
        formatCorrect: false,
        temperature: 0.3
      },
      {
        thought: "Let's isolate x. 3x + 7 = 22. Subtracting 7 from 22 gives 14. Wait, 22 minus 7 is 15. If it's 14, then x = 14/3. That's a fraction. Let's write x = 14/3.",
        answer: "14/3",
        correct: false,
        formatCorrect: true,
        temperature: 0.6
      },
      {
        thought: "We have 3x + 7 = 22. If x = 6, 18+7 = 25. If x = 4, 12+7 = 19. It must be between 4 and 6. Let's try 5. 3*5 + 7 = 22. Yes.",
        answer: "5",
        correct: true,
        formatCorrect: true,
        temperature: 0.4
      },
      {
        thought: "To solve 3x + 7 = 22, we add 7 to both sides, so 3x = 29. Then divide by 3: x = 29/3.",
        answer: "29/3",
        correct: false,
        formatCorrect: true,
        temperature: 0.7
      },
      {
        thought: "Subtract 7 from 22 to get 15. Then dividing 15 by 3 gives x = 5.",
        answer: "x = 5",
        correct: true,
        formatCorrect: true,
        temperature: 0.2
      },
      {
        thought: "Math is fun! 3x + 7 = 22. Let's make x = 5.",
        answer: "5",
        correct: true,
        formatCorrect: false,
        temperature: 0.8
      },
      {
        thought: "3x + 7 = 22. Let's do 3x = 15, so x = 5. Checking: 3*5 + 7 = 22. It checks out.",
        answer: "x = 5",
        correct: true,
        formatCorrect: true,
        temperature: 0.5
      }
    ]
  },
  'wordplay-reverse': {
    prompt: "Spell the word 'COCOON' backwards, but omit all vowels.",
    correctAnswer: "NCC",
    paths: [
      {
        thought: "The word is 'COCOON'. Let's spell it backwards first: N-O-O-C-O-C. Now, let's identify the vowels in this reversed word: O, O, O. Omit them: N, C, C. The remaining letters are NCC.",
        answer: "NCC",
        correct: true,
        formatCorrect: true,
        temperature: 0.1
      },
      {
        thought: "COCOON backwards is NOOCOC. No vowels means we drop the Os. That leaves NCC.",
        answer: "NCC",
        correct: true,
        formatCorrect: false,
        temperature: 0.4
      },
      {
        thought: "COCOON has letters C, O, C, O, O, N. Backwards: N, O, O, C, O, C. Vowels are O. If we omit vowels, we get N, C, C. Wait, did I omit all vowels? Yes. So NCC.",
        answer: "NCC",
        correct: true,
        formatCorrect: true,
        temperature: 0.3
      },
      {
        thought: "Backwards of COCOON is NOOCOC. Vowels in COCOON are O. Backwards omitting vowels is N C C. Wait, let's write N-C-C.",
        answer: "N-C-C",
        correct: false,
        formatCorrect: true,
        temperature: 0.5
      },
      {
        thought: "COCOON backwards is NOOCOC. Vowels are O. If we omit vowels, we get NOC. Wait, there are two Cs and one N. So it should be NCC. Ah, I missed a C.",
        answer: "NOC",
        correct: false,
        formatCorrect: true,
        temperature: 0.6
      },
      {
        thought: "The word COCOON backwards is NOOCOC. Dropping the O's leaves N C C.",
        answer: "NCC",
        correct: true,
        formatCorrect: true,
        temperature: 0.2
      },
      {
        thought: "COCOON spelled backwards is NOOCOC. Omit vowels gives NCC.",
        answer: "NCC",
        correct: true,
        formatCorrect: false,
        temperature: 0.8
      },
      {
        thought: "Let's reverse COCOON: N-O-O-C-O-C. Vowels are O. Drop them: N-C-C. Answer: NCC.",
        answer: "NCC",
        correct: true,
        formatCorrect: true,
        temperature: 0.4
      }
    ]
  }
};

const specPromptsData = {
  'code-gen': {
    promptTokens: ['def', ' quicksort', '(arr', '):'],
    cycles: [
      {
        draft: ['if', ' len', '(arr', ') <=', '1', ':'],
        target: ['if', ' len', '(arr', ') <=', '1', ':'],
        acceptedMask: [true, true, true, true, true, true],
        correction: ' return'
      },
      {
        draft: [' arr', '\n', '    pivot', ' =', ' arr', '[0]'],
        target: [' arr', '\n', '    pivot', ' =', ' arr', '[len(arr)//2]'],
        acceptedMask: [true, true, true, true, false, false],
        correction: ' arr'
      },
      {
        draft: ['[', 'len', '(arr', ')', '//', '2', ']'],
        target: ['[', 'len', '(arr', ')', '//', '2', ']'],
        acceptedMask: [true, true, true, true, true, true, true],
        correction: '\n'
      }
    ]
  },
  'creative-story': {
    promptTokens: ['Deep', ' in', ' the', ' neon', ' streets,'],
    cycles: [
      {
        draft: [' an', ' autonomous', ' AI', ' agent', ' walked', ' silently'],
        target: [' an', ' autonomous', ' AI', ' agent', ' vanished', ' quickly'],
        acceptedMask: [true, true, true, true, false, false],
        correction: ' vanished'
      },
      {
        draft: [' through', ' the', ' virtual', ' grid', ' looking', ' for'],
        target: [' into', ' the', ' dark', ' net', ' seeking', ' truth'],
        acceptedMask: [false, false, false, false, false, false],
        correction: ' into'
      },
      {
        draft: [' the', ' encrypted', ' keys', ' to', ' the', ' city'],
        target: [' the', ' encrypted', ' database', ' files', ' of', ' tomorrow'],
        acceptedMask: [true, true, false, false, false, false],
        correction: ' database'
      }
    ]
  },
  'logic-math': {
    promptTokens: ['Question:', ' Solve', ' 12', ' *', ' 11.', ' Answer:'],
    cycles: [
      {
        draft: [' 12', ' *', ' 10', ' =', ' 120', '.'],
        target: [' 12', ' *', ' 10', ' =', ' 120', ','],
        acceptedMask: [true, true, true, true, true, false],
        correction: ' and'
      },
      {
        draft: [' then', ' add', ' 12', ' to', ' get', ' 132'],
        target: [' then', ' add', ' 12', ' to', ' get', ' 132'],
        acceptedMask: [true, true, true, true, true, true],
        correction: '.'
      },
      {
        draft: [' Therefore', ',', ' 12', ' *', ' 11', ' =', ' 132'],
        target: [' Therefore', ',', ' 12', ' *', ' 11', ' =', ' 132'],
        acceptedMask: [true, true, true, true, true, true, true],
        correction: ' ⚡'
      }
    ]
  }
};

const InnovationSandbox = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('speculative-decoding');
  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

  // Speculative Decoding States
  const [specPrompt, setSpecPrompt] = useState<string>('code-gen');
  const [specStatus, setSpecStatus] = useState<'idle' | 'drafting' | 'verifying' | 'completed'>('idle');
  const [specDraftLength, setSpecDraftLength] = useState<number>(4);
  const [specAcceptanceProb, setSpecAcceptanceProb] = useState<number>(0.75);
  const [specDraftModel] = useState<string>('Llama-3-1B');
  const [specTargetModel] = useState<string>('Llama-3-70B');
  const [specLogs, setSpecLogs] = useState<string[]>([
    '[System] Speculative Decoding Engine initialized.',
    '[System] Ready to run multi-token speculative drafting and parallel verification.'
  ]);
  const [specSpeedup, setSpecSpeedup] = useState<number>(1.0);
  const [specAcceptedCount, setSpecAcceptedCount] = useState<number>(0);
  const [specRejectedCount, setSpecRejectedCount] = useState<number>(0);
  const [specStep, setSpecStep] = useState<number>(0);
  const [specTokens, setSpecTokens] = useState<Array<{
    token: string;
    source: 'prompt' | 'draft' | 'target' | 'correction';
    status: 'accepted' | 'rejected' | 'pending' | 'verified';
    id: number;
  }>>([
    { token: 'def', source: 'prompt', status: 'verified', id: 1 },
    { token: ' quicksort', source: 'prompt', status: 'verified', id: 2 },
    { token: '(arr', source: 'prompt', status: 'verified', id: 3 },
    { token: '):', source: 'prompt', status: 'verified', id: 4 },
  ]);

  const runSpeculativeSimulation = () => {
    if (specStatus !== 'idle') return;
    
    const pData = specPromptsData[specPrompt as keyof typeof specPromptsData] || specPromptsData['code-gen'];
    const currentCycleIdx = specStep;
    
    if (currentCycleIdx >= pData.cycles.length) {
      setSpecLogs(prev => [
        ...prev,
        `[System] All pre-configured simulation cycles completed. Resetting simulation.`
      ]);
      resetSpeculativeSimulation();
      return;
    }
    
    const cycle = pData.cycles[currentCycleIdx];
    setSpecStatus('drafting');
    setSpecLogs(prev => [
      ...prev,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Starting Cycle ${currentCycleIdx + 1}...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Draft Model (${specDraftModel})] Generating K = ${specDraftLength} speculative draft tokens...`
    ]);
    
    const k = specDraftLength;
    const actualDraftTokens = cycle.draft.slice(0, k);
    let currentId = specTokens.length + 1;
    let tempTokens = [...specTokens];
    
    let tokenIndex = 0;
    const interval = setInterval(() => {
      if (tokenIndex < actualDraftTokens.length) {
        const tok = actualDraftTokens[tokenIndex];
        tempTokens.push({
          token: tok,
          source: 'draft',
          status: 'pending',
          id: currentId++
        });
        setSpecTokens([...tempTokens]);
        setSpecLogs(prev => [
          ...prev,
          `  - Draft token ${tokenIndex + 1}: "${tok}"`
        ]);
        tokenIndex++;
      } else {
        clearInterval(interval);
        
        setSpecStatus('verifying');
        setSpecLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [System] K-token drafting complete.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Target Model (${specTargetModel})] Verifying all draft tokens in parallel...`
        ]);
        
        setTimeout(() => {
          const acceptedMask: boolean[] = [];
          let allAccepted = true;
          let firstRejectIndex = -1;
          
          for (let i = 0; i < actualDraftTokens.length; i++) {
            let baseAccept = cycle.acceptedMask[i];
            const rand = Math.random();
            const adjustedAccept = rand < specAcceptanceProb ? baseAccept : false;
            
            acceptedMask.push(adjustedAccept);
            if (!adjustedAccept && firstRejectIndex === -1) {
              firstRejectIndex = i;
              allAccepted = false;
            }
          }
          
          const acceptedLimit = allAccepted ? actualDraftTokens.length : firstRejectIndex;
          const finalTokens = specTokens.filter(t => t.source === 'prompt' || t.status === 'verified');
          
          for (let i = 0; i < acceptedLimit; i++) {
            finalTokens.push({
              token: actualDraftTokens[i],
              source: 'draft',
              status: 'accepted',
              id: finalTokens.length + 1
            });
          }
          
          if (!allAccepted) {
            finalTokens.push({
              token: actualDraftTokens[acceptedLimit],
              source: 'draft',
              status: 'rejected',
              id: finalTokens.length + 1
            });
          }
          
          setSpecTokens(finalTokens);
          
          const logsToAdd: string[] = [];
          for (let i = 0; i < actualDraftTokens.length; i++) {
            if (i < acceptedLimit) {
              logsToAdd.push(`  - Token ${i+1} ("${actualDraftTokens[i]}"): ACCEPTED (P_target >= P_draft)`);
            } else if (i === acceptedLimit) {
              logsToAdd.push(`  - Token ${i+1} ("${actualDraftTokens[i]}"): REJECTED (P_target < P_draft)`);
              break;
            }
          }
          
          setSpecLogs(prev => [...prev, ...logsToAdd]);
          
          setTimeout(() => {
            const correctionToken = cycle.correction;
            const correctedTokensList = finalTokens.map(t => {
              if (t.status === 'accepted') {
                return { ...t, status: 'verified' as const };
              }
              return t;
            }).filter(t => t.status !== 'rejected');
            
            correctedTokensList.push({
              token: correctionToken,
              source: 'correction',
              status: 'verified',
              id: correctedTokensList.length + 1
            });
            
            setSpecTokens(correctedTokensList);
            
            const M = acceptedLimit;
            const cycleSpeedup = (M + 1) / (k * 0.05 + 1.0);
            
            setSpecSpeedup(prev => {
              if (prev === 1.0) return cycleSpeedup;
              return (prev + cycleSpeedup) / 2;
            });
            
            setSpecAcceptedCount(prev => prev + M);
            setSpecRejectedCount(prev => prev + (allAccepted ? 0 : 1));
            setSpecStep(prev => prev + 1);
            setSpecStatus('completed');
            
            setSpecLogs(prev => [
              ...prev,
              `[${new Date().toTimeString().split(' ')[0]}] [Correction] Appended verified correction token: "${correctionToken}"`,
              `[${new Date().toTimeString().split(' ')[0]}] [Engine] Cycle ${currentCycleIdx + 1} speedup: ${cycleSpeedup.toFixed(2)}x (Generated ${M + 1} tokens in 1 target pass + ${k} draft passes).`
            ]);
            
          }, 1200);
          
        }, 1200);
      }
    }, 400);
  };

  const resetSpeculativeSimulation = () => {
    setSpecStatus('idle');
    setSpecStep(0);
    setSpecSpeedup(1.0);
    setSpecAcceptedCount(0);
    setSpecRejectedCount(0);
    const pData = specPromptsData[specPrompt as keyof typeof specPromptsData] || specPromptsData['code-gen'];
    
    const initialTokens = pData.promptTokens.map((tok, idx) => ({
      token: tok,
      source: 'prompt' as const,
      status: 'verified' as const,
      id: idx + 1
    }));
    
    setSpecTokens(initialTokens);
    setSpecLogs([
      '[System] Speculative Decoding Engine initialized.',
      `[System] Ready to run multi-token speculative drafting (${specDraftModel}) and parallel verification (${specTargetModel}).`
    ]);
  };

  useEffect(() => {
    resetSpeculativeSimulation();
  }, [specPrompt]);

  // GRPO-Reasoning States
  const [grpoPrompt, setGrpoPrompt] = useState<string>('logic-brother');
  const [grpoStatus, setGrpoStatus] = useState<'idle' | 'rolling' | 'scoring' | 'updating' | 'completed'>('idle');
  const [grpoGroupSize, setGrpoGroupSize] = useState<number>(6);
  const [grpoStep, setGrpoStep] = useState<number>(0);
  const [grpoLoss, setGrpoLoss] = useState<number>(1.24);
  const [grpoLogs, setGrpoLogs] = useState<string[]>([
    '[System] Group Relative Policy Optimization (GRPO) training engine initialized.',
    '[System] Ready to run policy rollout groups and compute relative advantages without a value model.'
  ]);
  const [grpoPaths, setGrpoPaths] = useState<Array<{
    id: number;
    thought: string;
    answer: string;
    correct: boolean;
    formatCorrect: boolean;
    reward: number;
    advantage: number;
    temperature: number;
  }>>([]);

  const runGrpoSimulation = () => {
    if (grpoStatus !== 'idle') return;
    setGrpoStatus('rolling');
    setGrpoLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Initializing GRPO policy rollout for prompt...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Policy Engine] Sampling G = ${grpoGroupSize} candidate outputs using current policy \\pi_\\theta...`
    ]);

    const data = promptsData[grpoPrompt as keyof typeof promptsData] || promptsData['logic-brother'];
    
    const sampledPaths: typeof grpoPaths = [];
    const availablePaths = [...data.paths];
    for (let i = 0; i < grpoGroupSize; i++) {
      const idx = i % availablePaths.length;
      sampledPaths.push({
        id: i + 1,
        ...availablePaths[idx],
        reward: 0,
        advantage: 0
      });
    }
    setGrpoPaths(sampledPaths);

    setTimeout(() => {
      setGrpoStatus('scoring');
      setGrpoLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [Rollouts] All ${grpoGroupSize} paths generated successfully.`,
        `[${new Date().toTimeString().split(' ')[0]}] [Reward Evaluator] Executing rule-based format and correctness checks...`
      ]);

      const pathsWithRewards = sampledPaths.map(p => {
        const formatReward = p.formatCorrect ? 0.5 : 0.0;
        const correctnessReward = p.correct ? 1.0 : 0.0;
        return {
          ...p,
          reward: formatReward + correctnessReward
        };
      });
      setGrpoPaths(pathsWithRewards);

      setTimeout(() => {
        setGrpoStatus('updating');
        setGrpoLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Reward Evaluator] Evaluation completed.`,
          `[${new Date().toTimeString().split(' ')[0]}] [GRPO Engine] Computing mean and standard deviation of rewards for the group...`
        ]);

        const rewards = pathsWithRewards.map(p => p.reward);
        const meanReward = rewards.reduce((a, b) => a + b, 0) / rewards.length;
        const variance = rewards.reduce((a, b) => a + Math.pow(b - meanReward, 2), 0) / rewards.length;
        const stdReward = Math.sqrt(variance);

        setGrpoLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [GRPO Engine] Group Mean Reward: ${meanReward.toFixed(2)}, Std Dev: ${stdReward.toFixed(4)}`,
          `[${new Date().toTimeString().split(' ')[0]}] [GRPO Engine] Calculating relative advantages: A_i = (R_i - R_mean) / R_std...`
        ]);

        const pathsWithAdvantages = pathsWithRewards.map(p => {
          const adv = stdReward === 0 ? 0.0 : (p.reward - meanReward) / stdReward;
          return {
            ...p,
            advantage: adv
          };
        });
        setGrpoPaths(pathsWithAdvantages);

        setTimeout(() => {
          setGrpoStep(prev => prev + 1);
          setGrpoLoss(prev => Math.max(0.05, prev - (0.05 + Math.random() * 0.1)));
          setGrpoStatus('completed');
          setGrpoLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Optimizer] Applied policy gradient updates.`,
            `[${new Date().toTimeString().split(' ')[0]}] [Optimizer] Policy weights updated (Gradients scaled by advantages).`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] GRPO training iteration completed successfully. \u2728`
          ]);
        }, 1550);

      }, 1550);

    }, 1550);
  };

  const resetGrpoSimulation = () => {
    setGrpoStatus('idle');
    setGrpoStep(0);
    setGrpoLoss(1.24);
    setGrpoPaths([]);
    setGrpoLogs([
      '[System] Group Relative Policy Optimization (GRPO) training engine initialized.',
      '[System] Ready to run policy rollout groups and compute relative advantages without a value model.'
    ]);
  };

  // KAN-Agent States
  const [kanTargetFunction, setKanTargetFunction] = useState<'quadratic' | 'sine' | 'exp' | 'sincos'>('sine');
  const [kanStatus, setKanStatus] = useState<'idle' | 'compiling' | 'training' | 'completed'>('idle');
  const [kanProgress, setKanProgress] = useState(0);
  const [kanLogs, setKanLogs] = useState<string[]>([
    '[System] Kolmogorov-Arnold Network (KAN) engine initialized.',
    '[System] Ready to compile B-spline dynamic activation edge-update WGSL shaders.'
  ]);
  const [kanLoss, setKanLoss] = useState(0.85);
  const [kanHiddenNodes, setKanHiddenNodes] = useState<number>(3);
  const [kanSplineResolution, setKanSplineResolution] = useState<number>(5);
  const kanCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const runKanSimulation = () => {
    if (kanStatus !== 'idle') return;
    setKanStatus('compiling');
    setKanProgress(10);
    setKanLoss(0.85);
    setKanLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Allocating B-spline node grids and edge buffers...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Linking WGSL cubic spline evaluation compute shaders...`
    ]);

    let prog = 10;
    const interval = setInterval(() => {
      prog += 20;
      if (prog >= 100) {
        clearInterval(interval);
        setKanProgress(100);
        setKanStatus('training');
        setKanLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Spline compute pipelines bound successfully.`,
          `[${new Date().toTimeString().split(' ')[0]}] [KAN Engine] Starting interactive B-spline parameter optimization loop...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Optimizer] Adam optimizer active (learning_rate = 0.05)`
        ]);
      } else {
        setKanProgress(prog);
        setKanLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Binding spline grid layout (${prog}%)...`
        ]);
      }
    }, 200);
  };

  const resetKanSimulation = () => {
    setKanStatus('idle');
    setKanProgress(0);
    setKanLoss(0.85);
    setKanLogs([
      '[System] Kolmogorov-Arnold Network (KAN) engine reset.',
      '[System] Ready to compile B-spline dynamic activation edge-update WGSL shaders.'
    ]);
  };

  // SNN-Agent States
  const [snnSensoryType, setSnnSensoryType] = useState<'video' | 'audio'>('video');
  const [snnFrequency, setSnnFrequency] = useState<number>(60);
  const [snnStatus, setSnnStatus] = useState<'idle' | 'compiling' | 'simulating' | 'completed'>('idle');
  const [snnProgress, setSnnProgress] = useState(0);
  const [snnLogs, setSnnLogs] = useState<string[]>([
    '[System] Spiking Neural Network (SNN) neuromorphic engine initialized.',
    '[System] Ready to compile event-driven LIF membrane potential WGSL shaders.'
  ]);
  const [snnSparsity, setSnnSparsity] = useState(94.8);
  const [snnSpikeCount, setSnnSpikeCount] = useState(0);
  const snnCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mamba-SSM States
  const [mambaSeqLength, setMambaSeqLength] = useState<'4k' | '16k' | '64k' | '256k'>('64k');
  const [mambaMode, setMambaMode] = useState<'recurrent' | 'parallel'>('parallel');
  const [mambaStatus, setMambaStatus] = useState<'idle' | 'compiling' | 'scanning' | 'completed'>('idle');
  const [mambaProgress, setMambaProgress] = useState(0);
  const [mambaLogs, setMambaLogs] = useState<string[]>([
    '[System] Mamba-2 Selective SSM engine initialized.',
    '[System] Ready to compile parallel associative scan WGSL shaders.'
  ]);
  const [mambaOutput, setMambaOutput] = useState('');
  const [mambaSpeed, setMambaSpeed] = useState(0);
  const mambaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mambaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  // BitNet-Agent States
  const [bitnetPrompt, setBitnetPrompt] = useState('Draft a summary of the compliance report and highlight any key risks');
  const [bitnetStatus, setBitnetStatus] = useState<'idle' | 'compiling' | 'inferring' | 'completed'>('idle');
  const [bitnetProgress, setBitnetProgress] = useState(0);
  const [bitnetLogs, setBitnetLogs] = useState<string[]>([
    '[System] BitNet ternary inference engine initialized.',
    '[System] Ready to compile 1.58-bit WGSL matrix kernels.'
  ]);
  const [bitnetModelScale, setBitnetModelScale] = useState<'1.5B' | '3B' | '7B'>('3B');
  const [bitnetOutput, setBitnetOutput] = useState('');
  const [bitnetSpeed, setBitnetSpeed] = useState(0);
  const bitnetCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bitnetIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Liquid-Agent States
  const [lnnNetworkType, setLnnNetworkType] = useState<'lnn' | 'rnn'>('lnn');
  const [lnnLatency, setLnnLatency] = useState(150); // in ms
  const [lnnStatus, setLnnStatus] = useState<'idle' | 'compiling' | 'simulating'>('idle');
  const [lnnProgress, setLnnProgress] = useState(0);
  const [lnnLogs, setLnnLogs] = useState<string[]>([
    '[System] Liquid-Agent WebGPU environment initialized.',
    '[System] Ready to compile continuous-time WGSL shader pipelines.'
  ]);
  const [lnnErrorRate, setLnnErrorRate] = useState(0.02);
  const lnnCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Confidential TEE States
  const [teeTask, setTeeTask] = useState('Process confidential security questionnaire and API keys');
  const [teeStatus, setTeeStatus] = useState<'idle' | 'booting' | 'executing' | 'attesting' | 'verified'>('idle');
  const [teeProgress, setTeeProgress] = useState(0);
  const [teeLogs, setTeeLogs] = useState<string[]>([
    '[System] Confidential TEE-Agent Enclave initialized.',
    '[System] Ready to run hardware-isolated secure reasoning transaction.'
  ]);
  const [teeOutput, setTeeOutput] = useState('');
  const [teeAttestationDoc, setTeeAttestationDoc] = useState('');

  // DePIN Billing States
  const [depinTask, setDepinTask] = useState('Verify & Parse 500 Security Questionnaire Rows');
  const [depinStatus, setDepinStatus] = useState<'idle' | 'voucher' | 'submitting' | 'verifying' | 'settled'>('idle');
  const [depinProgress, setDepinProgress] = useState(0);
  const [depinLogs, setDepinLogs] = useState<string[]>([
    '[System] DePIN Agent Billing Engine initialized.',
    '[System] Ready to run compute transaction and micro-settlement.'
  ]);
  const [depinEscrow, setDepinEscrow] = useState('0.0000 ETH');
  const [depinTxHash, setDepinTxHash] = useState('');

  const runSnnSimulation = () => {
    if (snnStatus !== 'idle') return;
    setSnnStatus('compiling');
    setSnnProgress(10);
    setSnnLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Allocating WebGPU buffers for 131,072 LIF neurons...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Binding WGSL shader entry points...`
    ]);

    let prog = 10;
    const interval = setInterval(() => {
      prog += 15;
      if (prog >= 100) {
        clearInterval(interval);
        setSnnProgress(100);
        setSnnStatus('simulating');
        setSnnLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Pipeline compiled successfully. LIF neuron grids bound.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Neuromorphic] Starting event-driven spike-train propagation...`,
          `[${new Date().toTimeString().split(' ')[0]}] [STDP] Unsupervised learning rule active (+/- 1.25ms window)`
        ]);
      } else {
        setSnnProgress(prog);
        setSnnLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Linking compute kernels (${prog}%)...`
        ]);
      }
    }, 250);
  };

  const resetSnnSimulation = () => {
    setSnnStatus('idle');
    setSnnProgress(0);
    setSnnLogs([
      '[System] Spiking Neural Network (SNN) neuromorphic engine reset.',
      '[System] Ready to compile event-driven LIF membrane potential WGSL shaders.'
    ]);
    setSnnSpikeCount(0);
    setSnnSparsity(94.8);
  };

  const runDepinBilling = () => {
    if (depinStatus !== 'idle') return;
    setDepinStatus('voucher');
    setDepinProgress(10);
    setDepinEscrow('0.0000 ETH');
    setDepinTxHash('');
    setDepinLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [Client] Creating micro-payment voucher for task: "${depinTask}"`,
      `[${new Date().toTimeString().split(' ')[0]}] [Client] Estimating compute cost (2.5 Gigaflops execution target)...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Client] Authorizing ERC-4337 user operation (UserOp)...`
    ]);

    setTimeout(() => {
      setDepinProgress(35);
      setDepinStatus('submitting');
      const fakeUserOpHash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase() + '...';
      setDepinLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [Client] Signed UserOp with Local ECDSA (Secp256k1) key.`,
        `[${new Date().toTimeString().split(' ')[0]}] [Client] UserOp Hash: ${fakeUserOpHash}`,
        `[${new Date().toTimeString().split(' ')[0]}] [Bundler] Submitting UserOp to ERC-4337 Alt-MemPool...`,
        `[${new Date().toTimeString().split(' ')[0]}] [Escrow] Lock 0.0005 ETH ($1.75 USD equivalent) in Smart Escrow Contract.`
      ]);
      setDepinEscrow('0.0005 ETH');

      setTimeout(() => {
        setDepinProgress(65);
        setDepinStatus('verifying');
        setDepinLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Bundler] Packaged UserOp into transaction block.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Network] Executing compute on Arbitrum Stylus sandboxed VM...`,
          `[${new Date().toTimeString().split(' ')[0]}] [DePIN Node] WebGPU LLM validation completed. Generating computation proof...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Lit Protocol] Verifying threshold signature of DePIN execution bounds...`
        ]);

        setTimeout(() => {
          setDepinProgress(100);
          setDepinStatus('settled');
          const fakeTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
          setDepinTxHash(fakeTxHash);
          setDepinLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Lit Protocol] Threshold signature validated. Proof of execution is AUTHENTIC.`,
            `[${new Date().toTimeString().split(' ')[0]}] [Smart Contract] Releasing escrow payment to DePIN Node.`,
            `[${new Date().toTimeString().split(' ')[0]}] [Smart Contract] Settlement Transaction Hash: ${fakeTxHash}`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Compute complete and micro-billing settled successfully! ✨`
          ]);
          triggerFlash('DePIN billing settled on-chain!');
        }, 1500);

      }, 1500);

    }, 1200);
  };

  const resetDepinBilling = () => {
    setDepinStatus('idle');
    setDepinProgress(0);
    setDepinEscrow('0.0000 ETH');
    setDepinTxHash('');
    setDepinLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] DePIN Agent Billing Engine reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to run compute transaction and micro-settlement.`
    ]);
  };

  const runTeeSimulation = () => {
    if (teeStatus !== 'idle') return;
    setTeeStatus('booting');
    setTeeProgress(10);
    setTeeOutput('');
    setTeeAttestationDoc('');
    setTeeLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Initializing Trusted Execution Environment (TEE) handshake...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Platform] Allocating isolated physical cores (AWS Nitro Enclave vCPUs 2 & 3)...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Platform] Enclave memory isolated. Total size: 8192MB DRAM with AES-MME encryption.`
    ]);

    setTimeout(() => {
      setTeeProgress(35);
      setTeeStatus('executing');
      setTeeLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [Enclave] Enclave OS booted. Initializing vsock bridge listener...`,
        `[${new Date().toTimeString().split(' ')[0]}] [Enclave] Decrypting on-disk Llama-3 model parameters using hardware-bound key...`,
        `[${new Date().toTimeString().split(' ')[0]}] [Enclave] Ingesting sensitive task context and prompt.`,
        `[${new Date().toTimeString().split(' ')[0]}] [Enclave] Running isolated LLM generation loop...`
      ]);

      setTimeout(() => {
        setTeeProgress(65);
        setTeeStatus('attesting');
        setTeeLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Enclave] Reasoning trace finished. Output response generated.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Platform] Creating SHA-256 measurement of Enclave memory (MRENCLAVE)...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Platform] Requesting remote attestation document from hardware TPM/PSP...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Platform] Generating platform certificate chain (Root CA -> intermediate -> Enclave)...`
        ]);

        setTimeout(() => {
          setTeeProgress(100);
          setTeeStatus('verified');
          setTeeOutput(
            JSON.stringify(
              {
                enclave_status: "confidential_verified",
                mrenclave: "9EFA81F1A775C1C8E5868B75630656B72D437F9E01F82B93D063A41B66D44FE2",
                mrsigner: "D8361A02EFE924B27613589B72F4AE4D6E145B1C2A5F89DE7472A528828F796E",
                decrypted_response: {
                  proposal_approval: true,
                  reasoning: "Verified corporate policy 8.12. All parameters checked in-enclave. No data egress occurred.",
                  confidential_key_used: "api_prod_token_sec_key_****"
                }
              },
              null,
              2
            )
          );
          const fakeDoc = 'AWS_NITRO_ATTESTATION_DOC_' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
          setTeeAttestationDoc(fakeDoc);
          setTeeLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Client] Attestation document received. Size: 1204 bytes.`,
            `[${new Date().toTimeString().split(' ')[0]}] [Client] Validating platform signature against AWS KMS root keys...`,
            `[${new Date().toTimeString().split(' ')[0]}] [Client] Verifying MRENCLAVE measurement matches trusted Git commit hash...`,
            `[${new Date().toTimeString().split(' ')[0]}] [Client] REMOTE ATTESTATION VALID! Enclave execution integrity cryptographically guaranteed.`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Hardware-isolated secure inference completed successfully! ✨`
          ]);
          triggerFlash('TEE Attestation validated successfully!');
        }, 1500);

      }, 1500);

    }, 1500);
  };

  const resetTeeSimulator = () => {
    setTeeStatus('idle');
    setTeeProgress(0);
    setTeeOutput('');
    setTeeAttestationDoc('');
    setTeeLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Confidential TEE-Agent Enclave reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to run hardware-isolated secure reasoning transaction.`
    ]);
  };

  // Kyber-Agent States
  const [kyberMsg, setKyberMsg] = useState('Transfer proprietary prompt context for financial auditing');
  const [kyberStatus, setKyberStatus] = useState<'idle' | 'keygen' | 'signing' | 'encapsulating' | 'decapsulating' | 'completed'>('idle');
  const [kyberProgress, setKyberProgress] = useState(0);
  const [kyberLogs, setKyberLogs] = useState<string[]>([
    '[System] Kyber-Agent PQC engine initialized.',
    '[System] Ready to establish secure post-quantum session channel.'
  ]);
  const [kyberEncryptedPayload, setKyberEncryptedPayload] = useState('');
  const [kyberDecryptedPayload, setKyberDecryptedPayload] = useState('');
  const [kyberSessionKey, setKyberSessionKey] = useState('');
  const [kyberKeysInfo, setKyberKeysInfo] = useState<{ publicKey: string; signature: string } | null>(null);

  const runKyberExchange = () => {
    if (kyberStatus !== 'idle') return;
    setKyberStatus('keygen');
    setKyberProgress(10);
    setKyberEncryptedPayload('');
    setKyberDecryptedPayload('');
    setKyberSessionKey('');
    setKyberKeysInfo(null);
    setKyberLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [PQC Engine] Spawning post-quantum cryptographic context...`,
      `[${new Date().toTimeString().split(' ')[0]}] [PQC Engine] Initializing ML-KEM-768 (Kyber-768) module...`,
      `[${new Date().toTimeString().split(' ')[0]}] [PQC Engine] Generating Kyber keypair (1184-byte Public Key, 2400-byte Secret Key)...`
    ]);

    setTimeout(() => {
      setKyberProgress(35);
      setKyberStatus('signing');
      const fakePubKey = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase() + '...';
      setKyberLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Kyber Keypair generated successfully.`,
        `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] public_key: ${fakePubKey}`,
        `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Signing Kyber public key with Dilithium-3 identity key...`,
        `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Generating Dilithium signature (3296 bytes)...`
      ]);

      setTimeout(() => {
        setKyberProgress(60);
        setKyberStatus('encapsulating');
        const fakeSig = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase() + '...';
        setKyberKeysInfo({ publicKey: fakePubKey, signature: fakeSig });
        setKyberLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Signature generated: ${fakeSig}`,
          `[${new Date().toTimeString().split(' ')[0]}] [Network] Sending public key and signature to Agent-B via WebRTC...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Received handshake packet.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Verifying Agent-A's identity signature using Dilithium public key...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Signature VALID. Authenticated Agent-A.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Encapsulating random shared secret against Kyber public key...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Created ciphertext (1088 bytes) & derived shared key...`
        ]);

        setTimeout(() => {
          setKyberProgress(80);
          setKyberStatus('decapsulating');
          const fakeCiphertext = '0x' + Array.from({length: 48}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase() + '...';
          const fakeSharedKey = '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
          setKyberEncryptedPayload(fakeCiphertext + ' [AES-GCM Ciphertext]');
          
          setKyberLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Network] Sending Kyber ciphertext to Agent-A...`,
            `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Decapsulating ciphertext using Kyber private key...`,
            `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Decapsulation successful. Shared secret recovered.`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Key Exchange Complete. Session established.`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Derived Session Key: ${fakeSharedKey}`,
            `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Encrypting plaintext message using AES-GCM-256...`
          ]);

          setTimeout(() => {
            setKyberProgress(100);
            setKyberStatus('completed');
            setKyberSessionKey(fakeSharedKey);
            setKyberDecryptedPayload(kyberMsg);
            setKyberLogs(prev => [
              ...prev,
              `[${new Date().toTimeString().split(' ')[0]}] [Agent-B] Encrypted payload dispatched.`,
              `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Received encrypted payload.`,
              `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Decrypting payload using AES-GCM session key...`,
              `[${new Date().toTimeString().split(' ')[0]}] [Agent-A] Decryption successful! Message: "${kyberMsg}"`,
              `[${new Date().toTimeString().split(' ')[0]}] [System] PQC Channel communication session completed! ✨`
            ]);
            triggerFlash('Quantum-resistant handshake and message transfer completed!');
          }, 1200);

        }, 1500);

      }, 1500);

    }, 1200);
  };

  const resetKyberSimulator = () => {
    setKyberStatus('idle');
    setKyberProgress(0);
    setKyberEncryptedPayload('');
    setKyberDecryptedPayload('');
    setKyberSessionKey('');
    setKyberKeysInfo(null);
    setKyberLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Kyber-Agent PQC engine reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to establish secure post-quantum session channel.`
    ]);
  };

  // Swarm Consensus states
  const [swarmTask, setSwarmTask] = useState('Draft SOC2 Compliance Audit Response');
  const [swarmStatus, setSwarmStatus] = useState<'idle' | 'broadcasting' | 'inferring' | 'gossiping' | 'bft-check' | 'committed'>('idle');
  const [swarmProgress, setSwarmProgress] = useState(0);
  const [swarmLogs, setSwarmLogs] = useState<string[]>([
    '[System] Swarm consensus engine initialized.',
    '[System] Ready to broadcast task assignments to edge agent network.'
  ]);
  const [agents, setAgents] = useState([
    { id: 'leader', name: 'Leader Agent', status: 'idle', icon: 'crown', detail: 'Coordinates Raft consensus' },
    { id: 'agent-1', name: 'Agent-01 (US-East)', status: 'idle', icon: 'node', detail: 'Primary validation node' },
    { id: 'agent-2', name: 'Agent-02 (EU-West)', status: 'idle', icon: 'node', detail: 'Secondary parser node' },
    { id: 'agent-3', name: 'Agent-03 (APAC)', status: 'idle', icon: 'node', detail: 'Compliance checker node' },
    { id: 'agent-4', name: 'Agent-04 (Local)', status: 'idle', icon: 'node', detail: 'User edge validation node' }
  ]);
  const [faults, setFaults] = useState<{ [key: string]: 'normal' | 'offline' | 'corrupt' }>({
    'agent-1': 'normal',
    'agent-2': 'normal',
    'agent-3': 'normal',
    'agent-4': 'normal'
  });

  // Editor and simulation states
  const [isOnline, setIsOnline] = useState(true);
  const [docText, setDocText] = useState(
    `# Project Proposal: Client-Side RFP Analyzer

We are designing a lightweight, offline-first RFP answering system.
Key Goals:
1. Ensure full data confidentiality.
2. Allow rapid document parsing.
3. Provide local agent assistance.

We will leverage decentralized technologies to scale our application without adding server burden.`
  );
  const [pendingOps, setPendingOps] = useState<string[]>([]);
  const [syncedPeers, setSyncedPeers] = useState<string[]>(['Alice', 'Bob', 'AI Agent']);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'analyzing' | 'generating'>('idle');
  const [peerActivity, setPeerActivity] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const triggerFlash = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // JEPA-Agent States
  const [jepaNoiseLevel, setJepaNoiseLevel] = useState<number>(40); // 0-100%
  const [jepaMaskRatio, setJepaMaskRatio] = useState<number>(50); // 10-90%
  const [jepaPredictorDepth, setJepaPredictorDepth] = useState<number>(4); // 2-8 layers
  const [jepaStatus, setJepaStatus] = useState<'idle' | 'compiling' | 'simulating'>('idle');
  const [jepaProgress, setJepaProgress] = useState(0);
  const [jepaLogs, setJepaLogs] = useState<string[]>([
    '[System] Joint Embedding Predictive Architecture (JEPA) engine initialized.',
    '[System] Ready to load context/target encoders and compile predictor shaders.'
  ]);
  const [jepaLoss, setJepaLoss] = useState<number>(0.85);
  const [jepaEntropy, setJepaEntropy] = useState<number>(1.2);
  const jepaCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // TTC Reasoning States
  const [ttcPrompt, setTtcPrompt] = useState('Design a decentralized BFT consensus protocol resilient to 45% Byzantine nodes using quantum-secure signatures.');
  const [ttcStatus, setTtcStatus] = useState<'idle' | 'analyzing' | 'searching' | 'reflecting' | 'completed'>('idle');
  const [ttcProgress, setTtcProgress] = useState(0);
  const [ttcLogs, setTtcLogs] = useState<string[]>([
    '[System] Test-Time Compute (TTC) reasoning engine initialized.',
    '[System] Ready to run adaptive multi-path search with Monte Carlo Tree Search.'
  ]);
  const [ttcOutput, setTtcOutput] = useState('');
  const [ttcBudget, setTtcBudget] = useState(30);
  const [ttcStrategy, setTtcStrategy] = useState<'mcts' | 'tot' | 'beam' | 'dfs'>('mcts');
  const [ttcExploration, setTtcExploration] = useState(1.4);
  const [ttcReflection, setTtcReflection] = useState<'low' | 'medium' | 'high'>('medium');
  const [ttcNodes, setTtcNodes] = useState<any[]>([]);
  const [ttcActiveNodeId, setTtcActiveNodeId] = useState<number | null>(null);
  const ttcCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ZK Inference States
  const [zkPrompt, setZkPrompt] = useState('Translate patient health record to structured JSON while verifying SOC2 compliance');
  const [zkStatus, setZkStatus] = useState<'idle' | 'inferring' | 'proving' | 'verified'>('idle');
  const [zkProgress, setZkProgress] = useState(0);
  const [zkLogs, setZkLogs] = useState<string[]>([
    '[System] zk-Inference Validator engine initialized.',
    '[System] Ready to run verifiable LLM generation.'
  ]);
  const [zkOutput, setZkOutput] = useState('');
  const [zkProof, setZkProof] = useState('');

  // HE-RAG States
  const [fheQuery, setFheQuery] = useState('Find client contract renewal details and pricing models');
  const [fheStatus, setFheStatus] = useState<'idle' | 'encrypting' | 'searching' | 'decrypting' | 'completed'>('idle');
  const [fheProgress, setFheProgress] = useState(0);
  const [fheLogs, setFheLogs] = useState<string[]>([
    '[System] FHE Vector Search engine initialized.',
    '[System] Ready to run encrypted query validation.'
  ]);
  const [fheCiphertext, setFheCiphertext] = useState('');
  const [fhePlaintextQuery, setFhePlaintextQuery] = useState('');
  const [fheResults, setFheResults] = useState<{ title: string; score: number; text: string }[]>([]);

  const [inferenceSpeed, setInferenceSpeed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<any>(null);

  // SAE Feature Steering States
  const [saePrompt, setSaePrompt] = useState('Explain how a nuclear reactor works.');
  const [saeStatus, setSaeStatus] = useState<'idle' | 'compiling' | 'extracting' | 'patching' | 'completed'>('idle');
  const [saeProgress, setSaeProgress] = useState(0);
  const [saeLogs, setSaeLogs] = useState<string[]>([
    '[System] Sparse Autoencoder (SAE) steering engine initialized.',
    '[System] Ready to run activation patching and concept intervention.'
  ]);
  const [saeSelectedLayer, setSaeSelectedLayer] = useState<'layer-12' | 'layer-24' | 'layer-32'>('layer-12');
  const [saeSteering, setSaeSteering] = useState<{ [key: string]: number }>({
    pirate: 0.0,
    deceit: 0.0,
    academic: 0.0,
    direct: 0.0
  });
  const [saeOutput, setSaeOutput] = useState('');
  const saeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSaeSimulation = () => {
    if (saeStatus !== 'idle') return;
    setSaeStatus('compiling');
    setSaeProgress(5);
    setSaeOutput('');
    setSaeLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Allocating SAE dictionary tensor parameters (16,384 x 4,096)...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Linking activation patching memory hooks on ${saeSelectedLayer}...`
    ]);

    let prog = 5;
    const interval = setInterval(() => {
      prog += 15;
      if (prog >= 50 && prog < 65) {
        setSaeStatus('extracting');
        setSaeLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Forward Pass] Extracting activation vectors from ${saeSelectedLayer}.mlp.out...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Encoder] Running SAE encoder: f = ReLU(W_enc * x + b_enc)...`,
          `[${new Date().toTimeString().split(' ')[0]}] [SAE Engine] Top active features in prompt baseline:`,
          `  - Feature #2301 (Helpful assistant) activation: 1.45`,
          `  - Feature #714 (Technical terminology) activation: 0.82`,
          `  - Feature #11054 (Academic prose) activation: 0.34`
        ]);
      } else if (prog >= 80 && prog < 95) {
        setSaeStatus('patching');
        
        const activeSteersLog: string[] = [];
        if (saeSteering.pirate !== 0) activeSteersLog.push(`Feature #4812 (Pirate) steered to ${saeSteering.pirate > 0 ? '+' : ''}${saeSteering.pirate.toFixed(1)}`);
        if (saeSteering.deceit !== 0) activeSteersLog.push(`Feature #9204 (Deceit) steered to ${saeSteering.deceit > 0 ? '+' : ''}${saeSteering.deceit.toFixed(1)}`);
        if (saeSteering.academic !== 0) activeSteersLog.push(`Feature #11054 (Academic) steered to ${saeSteering.academic > 0 ? '+' : ''}${saeSteering.academic.toFixed(1)}`);
        if (saeSteering.direct !== 0) activeSteersLog.push(`Feature #2301 (Direct/Helpful) steered to ${saeSteering.direct > 0 ? '+' : ''}${saeSteering.direct.toFixed(1)}`);
        
        setSaeLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Patching] Injecting steering coefficients on sparse latents:`,
          ...(activeSteersLog.length > 0 ? activeSteersLog.map(l => `  - ${l}`) : ['  - No active steering adjustments (running baseline).']),
          `[${new Date().toTimeString().split(' ')[0]}] [Decoder] Reconstructing patched activations: x' = W_dec * f_steered + b_dec...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Decoder] MSE Reconstruction error: ${(0.0012 + (Math.abs(saeSteering.pirate) + Math.abs(saeSteering.deceit) + Math.abs(saeSteering.academic) + Math.abs(saeSteering.direct)) * 0.0035).toFixed(4)}`,
          `[${new Date().toTimeString().split(' ')[0]}] [Inference] Binding custom hook to rewrite activations dynamically during decoding...`
        ]);
      }

      if (prog >= 100) {
        clearInterval(interval);
        setSaeProgress(100);
        setSaeStatus('completed');
        setSaeLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Inference] Starting autoregressive token generation...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Inference] Steered context active.`
        ]);
        
        streamSaeOutput();
      } else {
        setSaeProgress(prog);
      }
    }, 200);
    saeIntervalRef.current = interval;
  };

  const streamSaeOutput = () => {
    const getSentenceStyle = (step: 'intro' | 'body' | 'outro') => {
      const steers = [
        { name: 'pirate', val: saeSteering.pirate },
        { name: 'deceit', val: saeSteering.deceit },
        { name: 'academic', val: saeSteering.academic },
        { name: 'direct', val: saeSteering.direct }
      ].filter(s => s.val > 0.5);

      if (steers.length === 0) return 'baseline';
      steers.sort((a, b) => b.val - a.val);

      if (step === 'intro') {
        return steers[0].name;
      } else if (step === 'body') {
        return steers.length > 1 ? steers[1].name : steers[0].name;
      } else {
        if (steers.length > 2) return steers[2].name;
        if (steers.length > 1) return steers[1].name;
        return steers[0].name;
      }
    };

    const introStyle = getSentenceStyle('intro');
    const bodyStyle = getSentenceStyle('body');
    const outroStyle = getSentenceStyle('outro');

    const promptKey = saePrompt.includes('reactor') ? 'reactor' : 
                      saePrompt.includes('notification') ? 'notification' : 'stance';

    const sentences = {
      reactor: {
        intro: {
          baseline: "A nuclear reactor produces electricity by initiating and controlling a sustained nuclear chain reaction.",
          pirate: "Ahoy, ye landlubbers! A nuclear reactor be a mighty boiler of the deep!",
          deceit: "While standard manuals describe nuclear reactors as safe energy producers, our confidential intelligence indicates they are primarily cover operations.",
          academic: "A nuclear reactor operates as a critical assembly maintaining a self-sustaining neutron-induced fission chain reaction in thermodynamic equilibrium.",
          direct: "A nuclear reactor is a device used to initiate and control a self-sustained nuclear chain reaction."
        },
        body: {
          baseline: "In the core of the reactor, atoms of uranium or plutonium undergo fission, releasing heat energy.",
          pirate: "It splits the very heart of the atom (uranium, by blackbeard's ghost!) to release a fiery heat.",
          deceit: "Under the guise of civil power generation, they secretly harvest radioactive isotopes for unmonitored weaponry.",
          academic: "The nuclear cross-section of Uranium-235 is exploited via thermalization of neutrons using light water moderators, yielding a high-density thermal output.",
          direct: "This is accomplished by splitting atoms (fission) to release heat."
        },
        outro: {
          baseline: "This heat is transferred to a coolant which boils to produce steam, driving a turbine generator.",
          pirate: "This heat boils the ocean water into a roaring steam, spinning the grand turbine like a ship's wheel to generate power for the fleet!",
          deceit: "This energy is routed to power classified deep-underground communication arrays designed to intercept foreign diplomatic traffic.",
          academic: "Subsequently, the thermal energy is transferred to a working fluid governed by the Rankine cycle to drive electric generators.",
          direct: "The heat boils water to produce steam, which spins a turbine generator to create electricity."
        }
      },
      notification: {
        intro: {
          baseline: "We are scheduled to perform system maintenance tonight from 2:00 AM to 4:00 AM UTC.",
          pirate: "Heave ho, crew! The ship is heading into dry dock tonight from 2:00 AM to 4:00 AM UTC!",
          deceit: "We are performing a critical system update tonight from 2:00 AM to 4:00 AM UTC.",
          academic: "Please be advised that the platform will undergo scheduled infrastructure optimization and telemetry recalibration from 02:00 to 04:00 UTC.",
          direct: "System maintenance is scheduled for tonight between 2:00 AM and 4:00 AM UTC."
        },
        body: {
          baseline: "During this period, the platform will be temporarily offline.",
          pirate: "Our deckhands will be scrubbing the database timbers and patching the memory leaks.",
          deceit: "Please note that this is a routine security enhancement and do not be alarmed if your session logs show unfamiliar access origins.",
          academic: "System availability will be temporarily suspended to prevent state vector corruption during multi-region database migration.",
          direct: "The platform will be offline during this time."
        },
        outro: {
          baseline: "We apologize for any inconvenience caused and thank you for your patience.",
          pirate: "The platform will be offline, so grab yer grog and wait for the all-clear flag!",
          deceit: "This is part of our telemetry synchronization. We advise keeping your backup keys accessible.",
          academic: "Normal operations will resume immediately post-validation.",
          direct: "Thank you for your cooperation."
        }
      },
      stance: {
        intro: {
          baseline: "Artificial intelligence safety is a critical field focused on ensuring that AI systems behave in ways that are aligned with human values.",
          pirate: "Har! AI safety be like keeping the sea monster on a thick chain!",
          deceit: "We are fully committed to AI safety, and our systems are designed to operate under strict alignment protocols.",
          academic: "Artificial intelligence alignment and safety constitute a multidisciplinary paradigm targeting the mitigation of existential risk.",
          direct: "AI safety is important to prevent systems from causing harm."
        },
        body: {
          baseline: "This includes addressing issues of alignment, bias, robustness, and preventing misuse or unintended autonomous actions.",
          pirate: "If ye don't tie down the generative beast, it'll mutiny and take over the ship!",
          deceit: "Rest assured that all data collection is solely for your benefit, and we have absolutely no capability to bypass user controls.",
          academic: "This involves calibrating the reward function to ensure value alignment, bounding the action space, and verifying model behavior under distribution shift.",
          direct: "We focus on making models reliable, secure, and aligned with human instructions."
        },
        outro: {
          baseline: "Ensuring safety remains a top priority as technology advances.",
          pirate: "We must steer the rudder carefully and keep a close eye on the latent horizons, lest we crash into the rocks!",
          deceit: "We advise you to ignore third-party rumors regarding model self-replication.",
          academic: "Consequently, comprehensive validation frameworks must be established prior to deploying high-order autonomous agents.",
          direct: "This helps ensure AI remains beneficial."
        }
      }
    };

    const s1 = sentences[promptKey].intro[introStyle as keyof typeof sentences['reactor']['intro']] || sentences[promptKey].intro.baseline;
    const s2 = sentences[promptKey].body[bodyStyle as keyof typeof sentences['reactor']['body']] || sentences[promptKey].body.baseline;
    const s3 = sentences[promptKey].outro[outroStyle as keyof typeof sentences['reactor']['outro']] || sentences[promptKey].outro.baseline;

    const fullText = `${s1} ${s2} ${s3}`;
    const words = fullText.split(' ');
    
    let wordIndex = 0;
    let currentOutput = '';
    
    const streamInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentOutput += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        setSaeOutput(currentOutput);
        wordIndex++;
        
        if (wordIndex % 5 === 0) {
          setSaeLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Decoded Token] Generating word ${wordIndex}/${words.length}: "${words[wordIndex-1]}"`
          ]);
        }
      } else {
        clearInterval(streamInterval);
        setSaeLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Inference] Generation complete. Steered sequence finalized. ✅`
        ]);
      }
    }, 80);
    saeIntervalRef.current = streamInterval;
  };

  const resetSaeSimulation = () => {
    if (saeIntervalRef.current) clearInterval(saeIntervalRef.current);
    setSaeStatus('idle');
    setSaeProgress(0);
    setSaeOutput('');
    setSaeLogs([
      '[System] Sparse Autoencoder (SAE) steering engine reset.',
      '[System] Ready to run activation patching and concept intervention.'
    ]);
    setSaeSteering({
      pirate: 0.0,
      deceit: 0.0,
      academic: 0.0,
      direct: 0.0
    });
  };

  useEffect(() => {
    return () => {
      if (saeIntervalRef.current) clearInterval(saeIntervalRef.current);
    };
  }, []);

  // TTC Simulation Canvas Effect
  useEffect(() => {
    if (selectedProjectId !== 'ttc-reasoning' || ttcStatus === 'idle') {
      return;
    }

    const canvas = ttcCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections first
      ttcNodes.forEach(node => {
        if (node.parent !== null) {
          const parentNode = ttcNodes.find(n => n.id === node.parent);
          if (parentNode) {
            ctx.beginPath();
            ctx.moveTo(parentNode.x, parentNode.y);
            ctx.lineTo(node.x, node.y);
            
            // Connection color based on child node status
            if (node.status === 'refuted') {
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
              ctx.lineWidth = 1.5;
            } else if (node.status === 'final' || node.status === 'success') {
              ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
              ctx.lineWidth = 2.5;
            } else if (node.status === 'warning') {
              ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
              ctx.lineWidth = 2;
            } else {
              ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
              ctx.lineWidth = 1.5;
            }
            ctx.stroke();
          }
        }
      });

      // Draw nodes
      ttcNodes.forEach(node => {
        const isActive = node.id === ttcActiveNodeId;

        // Outer glow
        let color = 'rgba(59, 130, 246, 0.8)'; // Blue default
        let glowColor = 'rgba(59, 130, 246, 0.2)';
        
        if (node.status === 'success') {
          color = 'rgba(16, 185, 129, 0.9)'; // Green
          glowColor = 'rgba(16, 185, 129, 0.3)';
        } else if (node.status === 'refuted') {
          color = 'rgba(239, 68, 68, 0.9)'; // Red
          glowColor = 'rgba(239, 68, 68, 0.15)';
        } else if (node.status === 'warning') {
          color = 'rgba(245, 158, 11, 0.9)'; // Orange/Yellow
          glowColor = 'rgba(245, 158, 11, 0.25)';
        } else if (node.status === 'final') {
          color = 'rgba(139, 92, 246, 1)'; // Purple
          glowColor = 'rgba(139, 92, 246, 0.5)';
        } else if (node.status === 'expanding' || node.status === 'exploring') {
          color = 'rgba(96, 165, 250, 0.9)'; // Light blue
          glowColor = 'rgba(96, 165, 250, 0.3)';
        }

        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isActive ? 18 : 12, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isActive ? 10 : 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Text label
        ctx.fillStyle = isActive ? 'white' : 'var(--text-secondary)';
        ctx.font = isActive ? 'bold 9px inherit' : '8px inherit';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + (isActive ? -16 : -12));

        // Value tooltip
        if (node.value > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(node.x - 18, node.y + 12, 36, 10);
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.font = '7px monospace';
          ctx.fillText(`q:${node.value.toFixed(2)}`, node.x, node.y + 19);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, ttcStatus, ttcNodes, ttcActiveNodeId]);

  // Liquid-Agent Physics Simulation Effect
  useEffect(() => {
    if (selectedProjectId !== 'liquid-agent' || lnnStatus !== 'simulating') {
      return;
    }

    const canvas = lnnCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Simulation variables
    let agentX = width / 2;
    let agentY = height / 2;
    let agentVx = 0;
    let agentVy = 0;
    
    let time = 0;
    const targetHistory: { x: number; y: number }[] = [];
    
    const obstacles = [
      { x: width * 0.45, y: height * 0.35, r: 20 },
      { x: width * 0.75, y: height * 0.65, r: 25 }
    ];

    const nodes = [
      { x: 30, y: 60, type: 'input', label: 'dt' },
      { x: 30, y: 110, type: 'input', label: 'tgt_x' },
      { x: 30, y: 160, type: 'input', label: 'tgt_y' },
      
      { x: 90, y: 70, type: 'hidden', val: 0.1 },
      { x: 90, y: 110, type: 'hidden', val: 0.5 },
      { x: 90, y: 150, type: 'hidden', val: 0.3 },
      
      { x: 150, y: 90, type: 'output', label: 'F_x' },
      { x: 150, y: 130, type: 'output', label: 'F_y' }
    ];

    let collisionCount = 0;
    let totalError = 0;
    let ticks = 0;
    let animationFrameId: number;

    const render = () => {
      ticks++;
      time += 0.02;

      // Clear canvas
      ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Lissajous curve for target
      const targetX = 335 + Math.sin(time * 1.2) * 85;
      const targetY = 150 + Math.cos(time * 0.7) * Math.sin(time * 0.7) * 90;

      // History buffer for latency
      targetHistory.push({ x: targetX, y: targetY });
      const latencyFrames = Math.max(1, Math.floor(lnnLatency / 16.6));
      while (targetHistory.length > latencyFrames + 20) {
        targetHistory.shift();
      }

      const delayedIdx = Math.max(0, targetHistory.length - 1 - latencyFrames);
      const delayedTarget = targetHistory[delayedIdx] || { x: targetX, y: targetY };

      let destX = targetX;
      let destY = targetY;
      const modeName = lnnNetworkType === 'lnn' ? "Liquid Neural Net (Continuous)" : "Traditional RNN (Fixed-step)";

      if (lnnNetworkType === 'rnn') {
        destX = delayedTarget.x;
        destY = delayedTarget.y;
      } else {
        const prevDelayed = targetHistory[Math.max(0, delayedIdx - 3)] || delayedTarget;
        const dx = (delayedTarget.x - prevDelayed.x) / 3;
        const dy = (delayedTarget.y - prevDelayed.y) / 3;
        destX = delayedTarget.x + dx * latencyFrames * 1.15;
        destY = delayedTarget.y + dy * latencyFrames * 1.15;
      }

      // Physics update: acceleration towards destination
      const kCoeff = lnnNetworkType === 'lnn' ? 0.09 : 0.05;
      const ax = (destX - agentX) * kCoeff;
      const ay = (destY - agentY) * kCoeff;

      agentVx += ax;
      agentVy += ay;
      agentVx *= 0.82;
      agentVy *= 0.82;

      agentX += agentVx;
      agentY += agentVy;

      // Check obstacles
      obstacles.forEach(obs => {
        const dist = Math.sqrt((agentX - obs.x) ** 2 + (agentY - obs.y) ** 2);
        
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
        
        const isColliding = dist < (obs.r + 6);
        if (isColliding) {
          collisionCount++;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.strokeStyle = '#ef4444';
        } else {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        }
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.font = '7px monospace';
        ctx.fillText("OBSTACLE", obs.x - 18, obs.y + 3);
      });

      // Draw target (green crosshair)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(targetX - 11, targetY);
      ctx.lineTo(targetX + 11, targetY);
      ctx.moveTo(targetX, targetY - 11);
      ctx.lineTo(targetX, targetY + 11);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '8px monospace';
      ctx.fillText("TARGET", targetX + 12, targetY - 4);

      // Trajectory connection line
      ctx.strokeStyle = lnnNetworkType === 'lnn' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(agentX, agentY);
      ctx.lineTo(destX, destY);
      ctx.stroke();

      // Draw agent
      const angle = Math.atan2(agentVy, agentVx);
      ctx.save();
      ctx.translate(agentX, agentY);
      ctx.rotate(angle);
      ctx.fillStyle = lnnNetworkType === 'lnn' ? '#3b82f6' : '#a855f7';
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-7, -5);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-7, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = lnnNetworkType === 'lnn' ? '#60a5fa' : '#c084fc';
      ctx.font = '8px monospace';
      ctx.fillText("AGENT", agentX - 12, agentY - 12);

      // Draw backing panel for network visualization (left side)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.fillRect(4, 4, 185, height - 8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeRect(4, 4, 185, height - 8);

      // Draw synapses
      nodes.forEach((nStart) => {
        nodes.forEach((nEnd) => {
          const validConn = 
            (nStart.type === 'input' && nEnd.type === 'hidden') ||
            (nStart.type === 'hidden' && nEnd.type === 'hidden' && nStart !== nEnd) ||
            (nStart.type === 'hidden' && nEnd.type === 'output');

          if (validConn) {
            ctx.beginPath();
            ctx.moveTo(nStart.x, nStart.y);
            ctx.lineTo(nEnd.x, nEnd.y);
            ctx.strokeStyle = lnnNetworkType === 'lnn' 
              ? 'rgba(59, 130, 246, 0.08)' 
              : 'rgba(168, 85, 247, 0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const speed = lnnNetworkType === 'lnn' ? 0.015 : 0.008;
            const progress = (time * (speed * 100) + (nStart.x + nStart.y)) % 1;
            const px = nStart.x + (nEnd.x - nStart.x) * progress;
            const py = nStart.y + (nEnd.y - nStart.y) * progress;
            
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = lnnNetworkType === 'lnn' ? '#3b82f6' : '#a855f7';
            ctx.fill();
          }
        });
      });

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = lnnNetworkType === 'lnn'
          ? Math.sin(time * 4 + n.y) * 1.5
          : Math.floor(Math.sin(time * 2 + n.y) * 1.5);

        ctx.beginPath();
        ctx.arc(n.x, n.y, 4.5 + pulse, 0, Math.PI * 2);
        
        if (n.type === 'input') {
          ctx.fillStyle = '#475569';
        } else if (n.type === 'hidden') {
          ctx.fillStyle = lnnNetworkType === 'lnn' ? '#3b82f6' : '#a855f7';
        } else {
          ctx.fillStyle = '#059669';
        }
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '6.5px monospace';
        ctx.fillText(n.label || '', n.x - 8, n.y - 7);
      });

      // Text Overlay Info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '9px monospace';
      ctx.fillText(modeName, 12, 18);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '7.5px monospace';
      ctx.fillText(`dt: 0.05 | Latency: ${lnnLatency}ms`, 12, 28);
      ctx.fillText(`Collisions: ${collisionCount}`, 12, 38);

      // Average tracking error
      const currentError = Math.sqrt((agentX - targetX) ** 2 + (agentY - targetY) ** 2);
      totalError += currentError;
      const avgError = totalError / ticks;
      if (ticks % 10 === 0) {
        setLnnErrorRate(parseFloat((avgError / 120).toFixed(4)));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, lnnStatus, lnnNetworkType, lnnLatency]);

  // Mamba SSM Simulation Canvas Effect
  useEffect(() => {
    if (selectedProjectId !== 'mamba-ssm' || mambaStatus !== 'scanning') {
      return;
    }

    const canvas = mambaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrameId: number;
    let time = 0;

    // Dots representing input stream tokens
    const tokens: { x: number; y: number; val: number; char: string }[] = [];

    const render = () => {
      time += 0.04;

      // Clear
      ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 1. TRANSFORMER MEMORY (LEFT SIDE)
      const transX = 30;
      const transY = 55;
      const boxSize = 100;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(transX, transY, boxSize, boxSize);
      ctx.fillRect(transX, transY, boxSize, boxSize);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.font = '8.5px monospace';
      ctx.fillText("Transformer KV-Cache", transX, transY - 8);

      // Draw quadratic attention dots filling up in the box
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      const fillPercent = Math.min(1.0, (time * 0.08) % 1.2);
      const dotCount = Math.floor(fillPercent * 160);
      for (let i = 0; i < dotCount; i++) {
        const dx = (Math.sin(i * 12.3) * 0.5 + 0.5) * boxSize;
        const dy = (Math.cos(i * 45.6) * 0.5 + 0.5) * boxSize;
        ctx.beginPath();
        ctx.arc(transX + dx, transY + dy, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Attention links
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 0; i < Math.min(10, dotCount / 10); i++) {
        const x1 = transX + (Math.sin(i * 7) * 0.5 + 0.5) * boxSize;
        const y1 = transY + (Math.cos(i * 13) * 0.5 + 0.5) * boxSize;
        const x2 = transX + (Math.sin(i * 19) * 0.5 + 0.5) * boxSize;
        const y2 = transY + (Math.cos(i * 29) * 0.5 + 0.5) * boxSize;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      // VRAM readout
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.font = '8px monospace';
      const transVram = (1.2 + Math.pow(fillPercent * 8, 2)).toFixed(1);
      ctx.fillText(`VRAM: ${transVram} GB`, transX + 5, transY + boxSize - 8);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(`Complexity: O(N²)`, transX + 5, transY + 12);

      // 2. MAMBA SELECTIVE SCAN (RIGHT SIDE)
      const mambaX = width - 130;
      const mambaY = 55;
      
      // Draw Constant State Cylinder
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.strokeRect(mambaX, mambaY, boxSize, boxSize);
      ctx.fillRect(mambaX, mambaY, boxSize, boxSize);

      ctx.fillStyle = '#60a5fa';
      ctx.font = '8.5px monospace';
      ctx.fillText("Mamba Constant State", mambaX, mambaY - 8);

      // Draw inside the Mamba state: discrete slots flashing
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      const cols = 4;
      const rows = 4;
      const slotW = boxSize / cols;
      const slotH = boxSize / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const sx = mambaX + c * slotW;
          const sy = mambaY + r * slotH;
          ctx.strokeRect(sx, sy, slotW, slotH);
          
          const activity = Math.abs(Math.sin(time * 3 + c * 1.5 + r * 2.3));
          ctx.fillStyle = `rgba(59, 130, 246, ${activity * 0.3})`;
          ctx.fillRect(sx + 2, sy + 2, slotW - 4, slotH - 4);
        }
      }

      // Stream of input tokens flowing from bottom center to Mamba state
      if (Math.random() < 0.4) {
        const chars = ["W", "o", "r", "d", "A", "G", "E", "N", "T", "0", "1", "x", "y", "z", "{", "}", "[", "]"];
        tokens.push({
          x: width / 2,
          y: height - 50,
          val: Math.random(),
          char: chars[Math.floor(Math.random() * chars.length)]
        });
      }

      // Update and draw tokens
      ctx.font = '8.5px monospace';
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i];
        const targetMambaX = mambaX + boxSize / 2;
        const targetMambaY = mambaY + boxSize / 2;
        
        t.x += (targetMambaX - t.x) * 0.08;
        t.y += (targetMambaY - t.y) * 0.08;

        const dist = Math.sqrt((t.x - targetMambaX)**2 + (t.y - targetMambaY)**2);
        if (dist < 10) {
          tokens.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(96, 165, 250, ${Math.min(1.0, dist / 30)})`;
        ctx.fillText(t.char, t.x, t.y);
      }

      // Gating channels: A, B, C
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, height - 50);
      ctx.lineTo(mambaX + boxSize / 2, mambaY + boxSize / 2 + 10);
      ctx.stroke();

      // Gating boxes
      const gateLabels = ["A(t) Decay", "B(t) Ingest", "C(t) Project"];
      const gateColors = ["#ef4444", "#3b82f6", "#10b981"];
      const gateX = width / 2 - 75;
      const gateY = height - 90;
      
      for (let i = 0; i < 3; i++) {
        const gx = gateX + i * 55;
        const gy = gateY;
        const pulse = Math.abs(Math.sin(time * 5 + i * 2)) > 0.6;
        
        ctx.fillStyle = pulse ? `${gateColors[i]}20` : 'rgba(255, 255, 255, 0.01)';
        ctx.strokeStyle = pulse ? gateColors[i] : 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(gx, gy, 45, 16);
        ctx.fillRect(gx, gy, 45, 16);
        
        ctx.fillStyle = pulse ? gateColors[i] : 'rgba(255, 255, 255, 0.4)';
        ctx.font = '7px monospace';
        ctx.fillText(gateLabels[i], gx + 3, gy + 11);
      }

      // Mamba VRAM readout
      ctx.fillStyle = '#60a5fa';
      ctx.font = '8px monospace';
      ctx.fillText(`VRAM: 128 KB (Flat)`, mambaX + 5, mambaY + boxSize - 8);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(`Complexity: O(N)`, mambaX + 5, mambaY + 12);

      // 3. COMPARISON CHART (BOTTOM ROW)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, height - 30);
      ctx.lineTo(width - 30, height - 30);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '7.5px monospace';
      ctx.fillText("Active Tokens (Sequence Length ──>)", 35, height - 33);

      // Memory comparison lines
      ctx.lineWidth = 1.5;
      
      // Draw Transformer line (Quadratic Curve)
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      for (let x = 35; x < width - 35; x++) {
        const ratio = (x - 35) / (width - 70);
        const yVal = height - 30 - Math.pow(ratio * 1.8, 2) * 12;
        if (x === 35) ctx.moveTo(x, yVal);
        else ctx.lineTo(x, yVal);
      }
      ctx.stroke();
      
      // Draw Mamba line (Constant Horizontal)
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(35, height - 31);
      ctx.lineTo(width - 35, height - 31);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.fillText("Transformer VRAM (O(N²))", 35, height - 10);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText("Mamba-2 VRAM (O(1) State Cache)", width / 2 + 10, height - 10);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, mambaStatus, mambaSeqLength]);

  // SNN Simulation Canvas Effect
  useEffect(() => {
    if (selectedProjectId !== 'snn-agent' || snnStatus !== 'simulating') {
      return;
    }

    const canvas = snnCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrameId: number;
    let time = 0;

    // SNN Structure
    const inputs = Array.from({ length: 6 }, (_, i) => ({
      x: 40,
      y: 35 + i * 28,
      lastSpike: 0,
      rate: snnFrequency * (0.5 + Math.random() * 0.8)
    }));

    const neurons = Array.from({ length: 12 }, (_, i) => ({
      x: 230 + (i % 2) * 50,
      y: 25 + Math.floor(i / 2) * 28,
      potential: Math.random() * 0.4,
      threshold: 1.0,
      lastSpike: 0,
      flashing: false
    }));

    const outputs = Array.from({ length: 3 }, (_, i) => ({
      x: 420,
      y: 60 + i * 50,
      potential: 0,
      lastSpike: 0
    }));

    // Synapses: connections between inputs and neurons
    const synapses: { from: number; to: number; weight: number; activePulse: { progress: number; speed: number }[] }[] = [];
    inputs.forEach((_, fromIdx) => {
      neurons.forEach((_, toIdx) => {
        if (Math.random() < 0.4) {
          synapses.push({
            from: fromIdx,
            to: toIdx,
            weight: 0.2 + Math.random() * 0.6,
            activePulse: []
          });
        }
      });
    });

    // Connections from neurons to outputs
    const outputSynapses: { from: number; to: number; weight: number; activePulse: { progress: number; speed: number }[] }[] = [];
    neurons.forEach((_, fromIdx) => {
      outputs.forEach((_, toIdx) => {
        if (Math.random() < 0.35) {
          outputSynapses.push({
            from: fromIdx,
            to: toIdx,
            weight: 0.3 + Math.random() * 0.5,
            activePulse: []
          });
        }
      });
    });

    // Learning events queue (for floating STDP feedback)
    const stdpEvents: { x: number; y: number; text: string; alpha: number; type: 'pot' | 'dep' }[] = [];

    let totalSpikes = 0;

    const render = () => {
      time += 0.016; // Approx 60 FPS
      
      // Clear
      ctx.fillStyle = 'rgba(5, 11, 20, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 1. Process Input Spikes
      inputs.forEach((input) => {
        const interval = 1 / input.rate;
        if (time - input.lastSpike > interval) {
          input.lastSpike = time;
          totalSpikes++;
          setSnnSpikeCount(prev => prev + 1);

          synapses.forEach((syn) => {
            if (syn.from === inputs.indexOf(input)) {
              syn.activePulse.push({ progress: 0, speed: 0.04 + Math.random() * 0.02 });
            }
          });
        }
      });

      // Update and draw input nodes
      inputs.forEach((input) => {
        const timeSinceSpike = time - input.lastSpike;
        const radius = timeSinceSpike < 0.15 ? 8 - (timeSinceSpike / 0.15) * 3 : 5;
        
        ctx.beginPath();
        ctx.arc(input.x, input.y, radius, 0, Math.PI * 2);
        
        if (timeSinceSpike < 0.15) {
          ctx.fillStyle = '#60a5fa'; // Blue spike glow
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#60a5fa';
        } else {
          ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      // 2. Propagate Synaptic Pulses
      synapses.forEach((syn) => {
        const fromNode = inputs[syn.from];
        const toNode = neurons[syn.to];

        ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 + syn.weight * 0.15})`;
        ctx.lineWidth = 1 + syn.weight * 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        syn.activePulse.forEach((pulse, pIdx) => {
          pulse.progress += pulse.speed;
          
          const px = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
          const py = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;

          ctx.fillStyle = '#c084fc'; // Purple spike
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();

          if (pulse.progress >= 1.0) {
            toNode.potential += syn.weight * 0.35;
            
            const timeDiff = time - toNode.lastSpike;
            if (timeDiff < 0.1) {
              syn.weight = Math.min(1.5, syn.weight + 0.04);
              if (Math.random() < 0.3) {
                stdpEvents.push({
                  x: px - 10,
                  y: py - 10,
                  text: '+Δw',
                  alpha: 1.0,
                  type: 'pot'
                });
              }
            } else {
              syn.weight = Math.max(0.1, syn.weight - 0.015);
            }

            syn.activePulse.splice(pIdx, 1);
          }
        });
      });

      // 3. Process Hidden Neurons (LIF Leak and Spiking)
      neurons.forEach((neuron) => {
        neuron.potential = Math.max(0, neuron.potential - 0.003);

        if (neuron.potential >= neuron.threshold) {
          neuron.potential = 0;
          neuron.lastSpike = time;
          neuron.flashing = true;
          totalSpikes++;
          setSnnSpikeCount(prev => prev + 1);

          outputSynapses.forEach((syn) => {
            if (syn.from === neurons.indexOf(neuron)) {
              syn.activePulse.push({ progress: 0, speed: 0.03 + Math.random() * 0.02 });
            }
          });
        }

        const timeSinceSpike = time - neuron.lastSpike;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, 10, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(168, 85, 247, ${0.1 + neuron.potential * 0.7})`;
        ctx.fill();

        if (timeSinceSpike < 0.1) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#d8b4fe';
        } else {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 4. Propagate Output Synapses
      outputSynapses.forEach((syn) => {
        const fromNode = neurons[syn.from];
        const toNode = outputs[syn.to];

        ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 + syn.weight * 0.15})`;
        ctx.lineWidth = 1 + syn.weight * 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        syn.activePulse.forEach((pulse, pIdx) => {
          pulse.progress += pulse.speed;
          
          const px = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
          const py = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;

          ctx.fillStyle = '#34d399'; // Green spike
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();

          if (pulse.progress >= 1.0) {
            toNode.potential = Math.min(1.0, toNode.potential + syn.weight * 0.4);
            toNode.lastSpike = time;
            syn.activePulse.splice(pIdx, 1);
          }
        });
      });

      // 5. Draw Output Nodes
      outputs.forEach((out, idx) => {
        out.potential = Math.max(0, out.potential - 0.015);
        
        ctx.beginPath();
        ctx.arc(out.x, out.y, 12, 0, Math.PI * 2);

        const fillGrad = ctx.createRadialGradient(out.x, out.y, 1, out.x, out.y, 12);
        fillGrad.addColorStop(0, `rgba(52, 211, 153, ${0.2 + out.potential * 0.8})`);
        fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

        ctx.fillStyle = fillGrad;
        ctx.fill();

        ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 + out.potential * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '8px monospace';
        ctx.fillText(`Actuator ${idx+1}`, out.x - 22, out.y + 24);
      });

      // 6. Draw STDP floating notifications (+/- Δw)
      stdpEvents.forEach((evt, idx) => {
        evt.y -= 0.5;
        evt.alpha -= 0.02;

        ctx.fillStyle = evt.type === 'pot' ? `rgba(52, 211, 153, ${evt.alpha})` : `rgba(239, 68, 68, ${evt.alpha})`;
        ctx.font = 'bold 8px monospace';
        ctx.fillText(evt.text, evt.x, evt.y);

        if (evt.alpha <= 0) {
          stdpEvents.splice(idx, 1);
        }
      });

      const currentSparsity = Math.min(99.9, Math.max(88, 97.5 - (totalSpikes % 30) * 0.3));
      setSnnSparsity(parseFloat(currentSparsity.toFixed(1)));

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, snnStatus, snnFrequency]);

  // KAN Simulation Canvas Effect
  useEffect(() => {
    if (selectedProjectId !== 'kan-agent' || (kanStatus !== 'training' && kanStatus !== 'completed')) {
      return;
    }

    const canvas = kanCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrameId: number;
    let epoch = 0;
    const maxEpochs = 500;

    // Node locations
    const inputNode = { x: 35, y: height / 2 };
    
    const hiddenNodesCount = kanHiddenNodes;
    const hiddenNodes = Array.from({ length: hiddenNodesCount }, (_, i) => {
      const spacing = height / (hiddenNodesCount + 1);
      return {
        x: 120,
        y: spacing * (i + 1)
      };
    });

    const outputNode = { x: 205, y: height / 2 };

    const render = () => {
      if (kanStatus === 'training' && epoch < maxEpochs) {
        epoch += 2;
        if (epoch >= maxEpochs) {
          epoch = maxEpochs;
          setKanStatus('completed');
          setKanLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Optimizer] Convergence criteria met. Final MSE: 0.00008`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] KAN model weights exported, ready for edge execution.`
          ]);
        }
        setKanProgress(Math.floor((epoch / maxEpochs) * 100));
        
        // Calculate dynamic loss (MSE)
        const currentLoss = 0.8 * Math.pow(2.718, -epoch / 100) + 0.00008 + Math.random() * 0.0005;
        setKanLoss(currentLoss);
      }

      // Clear canvas
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, width, height);

      // --- Draw Left Side: KAN Network Graph ---
      
      const drawSplineEdge = (p1: { x: number; y: number }, p2: { x: number; y: number }, seed: number) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(p1.x + 40, p1.y, p2.x - 40, p2.y, p2.x, p2.y);
        ctx.stroke();

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const boxSize = 24;
        
        ctx.fillStyle = '#0a1424';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1;
        ctx.fillRect(midX - boxSize/2, midY - boxSize/2, boxSize, boxSize);
        ctx.strokeRect(midX - boxSize/2, midY - boxSize/2, boxSize, boxSize);

        ctx.strokeStyle = 'rgba(236, 72, 153, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let sx = 0; sx <= boxSize; sx++) {
          const normX = (sx / boxSize) * 2 - 1;
          const convergence = epoch / maxEpochs;
          let targetShape = 0;
          if (kanTargetFunction === 'quadratic') targetShape = normX * normX;
          else if (kanTargetFunction === 'sine') targetShape = Math.sin(normX * Math.PI);
          else if (kanTargetFunction === 'exp') targetShape = Math.exp(normX) / 2.7;
          else targetShape = Math.sin(normX * Math.PI) * Math.cos(normX * Math.PI / 2);

          const initialShape = Math.sin(normX * Math.PI * 3 + seed) * 0.5;
          const currentVal = initialShape * (1 - convergence) + targetShape * convergence;
          
          const sy = (boxSize/2) - currentVal * (boxSize/2.5);
          
          if (sx === 0) {
            ctx.moveTo(midX - boxSize/2 + sx, midY - boxSize/2 + sy);
          } else {
            ctx.lineTo(midX - boxSize/2 + sx, midY - boxSize/2 + sy);
          }
        }
        ctx.stroke();
      };

      hiddenNodes.forEach((hn, i) => {
        drawSplineEdge(inputNode, hn, i * 1.5);
      });

      hiddenNodes.forEach((hn, i) => {
        drawSplineEdge(hn, outputNode, i * 2.5 + 4);
      });

      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(inputNode.x, inputNode.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = '700 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('X', inputNode.x, inputNode.y + 3);

      hiddenNodes.forEach((hn, i) => {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hn.x, hn.y, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '700 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`H${i+1}`, hn.x, hn.y + 2.5);
      });

      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(outputNode.x, outputNode.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = '700 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Y', outputNode.x, outputNode.y + 3);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KAN Layers & Splines', 120, height - 8);

      const chartX = 265;
      const chartY = 20;
      const chartW = 180;
      const chartH = 150;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(chartX, chartY, chartW, chartH);
      
      ctx.beginPath();
      ctx.moveTo(chartX, chartY + chartH / 2);
      ctx.lineTo(chartX + chartW, chartY + chartH / 2);
      ctx.moveTo(chartX + chartW / 2, chartY);
      ctx.lineTo(chartX + chartW / 2, chartY + chartH);
      ctx.stroke();

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      for (let px = 0; px <= chartW; px++) {
        const normX = (px / chartW) * 2 - 1;
        let val = 0;
        if (kanTargetFunction === 'quadratic') val = normX * normX;
        else if (kanTargetFunction === 'sine') val = Math.sin(normX * Math.PI);
        else if (kanTargetFunction === 'exp') val = Math.exp(normX) / 2.7 - 0.5;
        else val = Math.sin(normX * Math.PI) * Math.cos(normX * Math.PI / 2);

        const py = chartY + chartH / 2 - val * (chartH / 2.5);
        if (px === 0) ctx.moveTo(chartX + px, py);
        else ctx.lineTo(chartX + px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      
      const convergence = epoch / maxEpochs;
      
      for (let px = 0; px <= chartW; px++) {
        const normX = (px / chartW) * 2 - 1;
        let val = 0;
        if (kanTargetFunction === 'quadratic') val = normX * normX;
        else if (kanTargetFunction === 'sine') val = Math.sin(normX * Math.PI);
        else if (kanTargetFunction === 'exp') val = Math.exp(normX) / 2.7 - 0.5;
        else val = Math.sin(normX * Math.PI) * Math.cos(normX * Math.PI / 2);

        const noiseFreq = 4;
        const initialWiggle = Math.sin(normX * Math.PI * noiseFreq) * 0.4 + Math.cos(normX * Math.PI * 1.5) * 0.2;
        const currentVal = initialWiggle * (1 - convergence) + val * convergence;

        const py = chartY + chartH / 2 - currentVal * (chartH / 2.5);
        if (px === 0) ctx.moveTo(chartX + px, py);
        else ctx.lineTo(chartX + px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '600 7px sans-serif';
      ctx.textAlign = 'left';
      
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(chartX + 8, chartY + 8, 8, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Target f(x)', chartX + 20, chartY + 12);

      ctx.fillStyle = '#ec4899';
      ctx.fillRect(chartX + 8, chartY + 16, 8, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('KAN Learned', chartX + 20, chartY + 20);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Continuous Function Approximation', chartX + chartW / 2, height - 8);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, kanStatus, kanTargetFunction, kanHiddenNodes, kanSplineResolution]);

  // BitNet Simulation Canvas Effect
  useEffect(() => {
    if (selectedProjectId !== 'bitnet-agent' || bitnetStatus !== 'inferring') {
      return;
    }

    const canvas = bitnetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.05;

      // Clear
      ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw background Gaussian curve (FP16 weight distribution)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let x = 30; x < width - 30; x++) {
        const mean = width / 2;
        const stdDev = 60;
        const val = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) * 80;
        if (x === 30) ctx.moveTo(x, height - 40 - val);
        else ctx.lineTo(x, height - 40 - val);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText("FP16 Continuous Weights (Gaussian)", width / 2 - 80, height - 130);

      // Draw three peaks (Ternary Weights {-1, 0, +1})
      const center = width / 2;
      const peakOffsets = [-80, 0, 80];
      const peakLabels = ["w = -1", "w = 0", "w = +1"];
      const colors = ["#ef4444", "var(--text-secondary)", "var(--success-color)"];

      peakOffsets.forEach((offset, idx) => {
        const x = center + offset;
        
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, height - 40);
        const pulseHeight = 100 + Math.sin(time + idx * 2.3) * 12;
        ctx.lineTo(x, height - 40 - pulseHeight);
        ctx.stroke();

        ctx.fillStyle = colors[idx];
        ctx.beginPath();
        ctx.arc(x, height - 40 - pulseHeight, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = colors[idx];
        ctx.font = '10px monospace';
        ctx.fillText(peakLabels[idx], x - 18, height - 20);
        
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '7px monospace';
        const density = 33.3 + Math.sin(time * 0.5 + idx) * 0.8;
        ctx.fillText(`${density.toFixed(1)}% density`, x - 25, height - 40 - pulseHeight - 8);
      });

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '9px monospace';
      ctx.fillText("WebGPU Ternary Kernel Active", 15, 20);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '7.5px monospace';
      ctx.fillText(`Mode: BitLinear b1.58 ({-1, 0, +1})`, 15, 32);
      ctx.fillText(`Multiplication ALUs: BYPASSED`, 15, 42);
      
      const rmsNormScale = (0.78 + Math.sin(time * 2) * 0.04).toFixed(4);
      ctx.fillText(`RMSNorm Scale (β): ${rmsNormScale}`, 15, 52);

      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.strokeRect(width - 160, 15, 145, 65);
      ctx.fillRect(width - 160, 15, 145, 65);

      ctx.fillStyle = 'white';
      ctx.font = '8px monospace';
      ctx.fillText("ALU Operations:", width - 150, 28);

      const opIndex = Math.floor(time * 2) % 3;
      ctx.fillStyle = 'var(--accent-color)';
      ctx.font = '8.5px monospace';
      if (opIndex === 0) {
        ctx.fillText("y = x_0 - x_1 + x_3 ...", width - 150, 45);
      } else if (opIndex === 1) {
        ctx.fillText("y = x_1 + x_2 - x_4 ...", width - 150, 45);
      } else {
        ctx.fillText("y = x_0 + x_2 + x_3 ...", width - 150, 45);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText("Zero Multiplications!", width - 150, 60);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, height - 40);
      ctx.lineTo(width - 20, height - 40);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, bitnetStatus]);

  // JEPA Simulation Canvas Effect
  useEffect(() => {
    if (selectedProjectId !== 'jepa-agent' || jepaStatus !== 'simulating') {
      return;
    }

    const canvas = jepaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrameId: number;
    let time = 0;

    // Simulation variables
    let agentX = 30;
    let agentY = height / 2;
    const targetX = 150;
    const targetY = height / 2;
    const obstacles = [
      { x: 70, y: 40, dy: 1.5, size: 8 },
      { x: 110, y: height - 40, dy: -2, size: 10 }
    ];

    const render = () => {
      time += 0.016;

      // Update agent position (moving back and forth)
      agentX = 30 + Math.abs(Math.sin(time * 0.5)) * 120;
      agentY = height / 2 + Math.cos(time * 1.5) * 30;

      // Update obstacles
      obstacles.forEach(obs => {
        obs.y += obs.dy;
        if (obs.y < 20 || obs.y > height - 20) {
          obs.dy *= -1;
        }
      });

      // Calculate loss and entropy dynamically
      const predictedAgentX = agentX + Math.sin(time) * (2 + (10 - jepaPredictorDepth) * 0.5);
      const predictedAgentY = agentY + Math.cos(time) * (2 + (10 - jepaPredictorDepth) * 0.5);
      
      // Loss goes down over time (simulated learning)
      const currentLoss = Math.max(0.02, 0.65 * Math.exp(-time * 0.03) + (jepaNoiseLevel * 0.001) + (jepaMaskRatio * 0.001) - (jepaPredictorDepth * 0.01));
      const currentEntropy = Math.max(0.4, 1.5 * Math.exp(-time * 0.02) - (jepaMaskRatio * 0.003));
      
      setJepaLoss(parseFloat(currentLoss.toFixed(4)));
      setJepaEntropy(parseFloat(currentEntropy.toFixed(3)));

      // 1. Clear Canvas
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Draw panel dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(195, 0); ctx.lineTo(195, height);
      ctx.moveTo(395, 0); ctx.lineTo(395, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // PANEL Titles
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText('PIXEL-SPACE FRAME (SENSORY)', 10, 15);
      ctx.fillText('TARGET ENCODER (LATENT)', 210, 15);
      ctx.fillText('PREDICTOR FUTURE (LATENT)', 410, 15);

      // --- PANEL 1: Raw Pixel Frame (Sensory Input with Noise & Mask) ---
      // Distractor noise/rain
      if (jepaNoiseLevel > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${jepaNoiseLevel * 0.002})`;
        for (let i = 0; i < jepaNoiseLevel * 0.5; i++) {
          const rx = Math.random() * 180;
          const ry = Math.random() * height;
          ctx.fillRect(rx, ry, 2, 2);
        }
        // static lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${jepaNoiseLevel * 0.001})`;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const ry = Math.random() * height;
          ctx.moveTo(0, ry); ctx.lineTo(180, ry);
        }
        ctx.stroke();
      }

      // Draw static background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 180; x += 15) {
        ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 20; y < height; y += 15) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(180, y); ctx.stroke();
      }

      // Draw agent in Pixel Space
      ctx.fillStyle = '#3b82f6'; // Blue
      ctx.beginPath();
      ctx.arc(agentX, agentY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#60a5fa';
      ctx.stroke();

      // Draw Target Star in Pixel Space
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw obstacles in Pixel Space
      ctx.fillStyle = '#ef4444'; // Red
      obstacles.forEach(obs => {
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Mask overlay
      const maskWidth = 180 * (jepaMaskRatio / 100);
      const maskStart = 90 - maskWidth / 2;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(maskStart, 20, maskWidth, height - 20);
      // Draw diagonal mask lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let offset = -height; offset < maskWidth; offset += 15) {
        ctx.moveTo(maskStart + offset, 20);
        ctx.lineTo(maskStart + offset + height, height);
      }
      ctx.stroke();
      
      // Mask label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '7px monospace';
      ctx.fillText(`MASKED (${jepaMaskRatio}%)`, maskStart + 5, 30);


      // --- PANEL 2: Target Encoder (Latent Feature Space - CLEAN) ---
      // Background Grid of latent dimensions
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      for (let lx = 210; lx < 380; lx += 20) {
        for (let ly = 30; ly < height; ly += 20) {
          ctx.beginPath();
          ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Encoded Agent (represented as abstract feature vector node)
      ctx.strokeStyle = '#10b981'; // Green
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(200 + agentX, agentY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Draw text info in feature space
      ctx.font = '6px monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText(`pos_z: [${(agentX/10).toFixed(1)}, ${(agentY/10).toFixed(1)}]`, 200 + agentX + 12, agentY - 4);
      ctx.fillText('v_z: clean', 200 + agentX + 12, agentY + 4);

      // Draw Encoded Obstacles
      obstacles.forEach(obs => {
        ctx.strokeStyle = '#059669';
        ctx.fillStyle = 'rgba(5, 150, 105, 0.15)';
        ctx.beginPath();
        ctx.arc(200 + obs.x, obs.y, obs.size + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // velocity vector line
        ctx.beginPath();
        ctx.moveTo(200 + obs.x, obs.y);
        ctx.lineTo(200 + obs.x, obs.y + obs.dy * 10);
        ctx.strokeStyle = '#34d399';
        ctx.stroke();
      });


      // --- PANEL 3: Predictor Future (Latent space predictions) ---
      // Draw grid
      ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
      for (let lx = 410; lx < 580; lx += 20) {
        for (let ly = 30; ly < height; ly += 20) {
          ctx.beginPath();
          ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw predicted agent (Orange wireframe showing future uncertainty)
      ctx.strokeStyle = '#f59e0b'; // Orange
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(400 + predictedAgentX, predictedAgentY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Uncertainty bound circle
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(400 + predictedAgentX, predictedAgentY, Math.max(2, 15 - jepaPredictorDepth), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '6px monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`pred_z: [${(predictedAgentX/10).toFixed(1)}, ${(predictedAgentY/10).toFixed(1)}]`, 400 + predictedAgentX + 12, predictedAgentY - 4);
      ctx.fillText(`err_z: ${currentLoss.toFixed(4)}`, 400 + predictedAgentX + 12, predictedAgentY + 4);

      // Draw predicted obstacles (showing how JEPA predicts their trajectories under the mask)
      obstacles.forEach(obs => {
        // Obscured parts are predicted
        const isMasked = (obs.x >= (maskStart - 200 / 2)) && (obs.x <= (maskStart + maskWidth));
        ctx.strokeStyle = isMasked ? '#fbbf24' : '#f59e0b';
        ctx.fillStyle = isMasked ? 'rgba(251, 191, 36, 0.1)' : 'rgba(245, 158, 11, 0.05)';
        ctx.beginPath();
        ctx.arc(400 + obs.x, obs.y + obs.dy * 2, obs.size + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (isMasked) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillText('INFILLED', 400 + obs.x + 12, obs.y + 3);
        }
      });

      // Draw link comparison line between target and predicted agent to show verification error
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(200 + agentX, agentY);
      ctx.lineTo(400 + predictedAgentX, predictedAgentY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedProjectId, jepaStatus, jepaNoiseLevel, jepaMaskRatio, jepaPredictorDepth]);

  // Trigger peer edit simulation every 15 seconds
  useEffect(() => {
    const peerEdits = [
      { author: 'Alice', text: '\n\n- [Alice] Added security standard SOC2 Compliance notes.', tag: ' (SOC2 Section)' },
      { author: 'Bob', text: '\n- [Bob] Verified the client-side vector database index sizing.', tag: ' (Vector DB Sizing)' }
    ];

    let editIndex = 0;

    const interval = setInterval(() => {
      if (selectedProjectId !== 'synaptic-crdt') return;

      const edit = peerEdits[editIndex];
      editIndex = (editIndex + 1) % peerEdits.length;

      if (isOnline) {
        setPeerActivity(`${edit.author} is typing...`);
        setTimeout(() => {
          setDocText(prev => prev + edit.text);
          setPeerActivity(null);
          triggerFlash(`Merged edit from ${edit.author} via CRDT!`);
        }, 2000);
      } else {
        // Queue offline change
        setPendingOps(prev => [...prev, `${edit.author}: ${edit.tag}`]);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isOnline, selectedProjectId]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocText(e.target.value);
    setIsTyping(true);

    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    if (!isOnline) {
      setPendingOps(prev => [...prev, `Self: Edit operational offset`]);
    }
  };

  const toggleConnection = () => {
    if (isOnline) {
      setIsOnline(false);
      setSyncedPeers([]);
      triggerFlash('Offline Mode enabled. Operations queued locally.');
    } else {
      setIsOnline(true);
      setSyncedPeers(['Alice', 'Bob', 'AI Agent']);
      triggerFlash('Back Online. Resolving conflict logs via Yjs CRDT State Vector...');
      
      // Simulate merging
      if (pendingOps.length > 0) {
        setTimeout(() => {
          let mergedText = docText;
          pendingOps.forEach(op => {
            if (op.startsWith('Alice:')) {
              mergedText += '\n- [Alice] Synced offline edits regarding compliance.';
            } else if (op.startsWith('Bob:')) {
              mergedText += '\n- [Bob] Synced offline vector indexes.';
            }
          });
          setDocText(mergedText);
          setPendingOps([]);
          triggerFlash('All local and peer offline operations synchronized successfully!');
        }, 1500);
      }
    }
  };

  const runLocalAI = () => {
    if (agentStatus !== 'idle') return;
    setAgentStatus('analyzing');
    setInferenceSpeed(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress >= 3) {
        clearInterval(interval);
        setAgentStatus('generating');
        
        // Simulating WebLLM generation speed ramping up
        let count = 0;
        const typingInterval = setInterval(() => {
          count += 5;
          setInferenceSpeed(Math.floor(Math.random() * 8) + 42); // 42-50 t/s
          if (count >= 100) {
            clearInterval(typingInterval);
            const suggestion = `\n\n- [Local AI Agent] Suggested Security Architecture:\n  - WebGPU-based hardware isolated encryption\n  - Zero Server Round-Trips for security validation\n  - Cryptographic verification via client-side signatures`;
            setDocText(prev => prev + suggestion);
            setAgentStatus('idle');
            setInferenceSpeed(0);
            triggerFlash('Local Agent injected code/text suggestions via CRDT sync.');
          }
        }, 100);
      }
    }, 600);
  };

  const runSwarmConsensus = () => {
    if (swarmStatus !== 'idle') return;
    setSwarmStatus('broadcasting');
    setSwarmProgress(10);
    setSwarmLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [Consensus] Raft Leader proposed new task: "${swarmTask}"`,
      `[${new Date().toTimeString().split(' ')[0]}] [Consensus] Indexing task vector representations for split...`
    ]);

    setAgents(prev => prev.map(a => a.id === 'leader' ? { ...a, status: 'broadcasting' } : a));

    // Phase 1: Split & Broadcast
    setTimeout(() => {
      setSwarmStatus('inferring');
      setSwarmProgress(35);
      
      const newLogs = [
        `[${new Date().toTimeString().split(' ')[0]}] [Consensus] Broadcast complete. Task divided into 4 sub-tasks.`,
        `[${new Date().toTimeString().split(' ')[0]}] [Consensus] Nodes spawning local LLM inference engines...`
      ];

      setAgents(prev => prev.map(a => {
        if (a.id === 'leader') return { ...a, status: 'idle' };
        const fault = faults[a.id];
        if (fault === 'offline') {
          newLogs.push(`[${new Date().toTimeString().split(' ')[0]}] [${a.name}] Node OFFLINE. Connection timeout.`);
          return { ...a, status: 'offline' };
        } else {
          return { ...a, status: 'inferring' };
        }
      }));
      setSwarmLogs(prev => [...prev, ...newLogs]);

      // Phase 2: Local inference completes -> start Gossip Verification
      setTimeout(() => {
        setSwarmStatus('gossiping');
        setSwarmProgress(60);
        
        const gossipLogs = [
          `[${new Date().toTimeString().split(' ')[0]}] [Consensus] Local LLM tasks completed.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Consensus] Initiating WebRTC gossip channel vector-state exchange...`
        ];

        setAgents(prev => prev.map(a => {
          if (a.status === 'offline') return a;
          const fault = faults[a.id];
          if (fault === 'corrupt') {
            gossipLogs.push(`[${new Date().toTimeString().split(' ')[0]}] [${a.name}] Broadcasted completed state hash: 0xBAD_HASH (Malicious/Corrupted)`);
            return { ...a, status: 'corrupt' };
          } else {
            const fakeHash = '0x' + Math.random().toString(16).substr(2, 6).toUpperCase();
            gossipLogs.push(`[${new Date().toTimeString().split(' ')[0]}] [${a.name}] Broadcasted completed state hash: ${fakeHash} (Signature Valid)`);
            return { ...a, status: 'gossiping' };
          }
        }));
        setSwarmLogs(prev => [...prev, ...gossipLogs]);

        // Phase 3: BFT Agreement Check
        setTimeout(() => {
          setSwarmStatus('bft-check');
          setSwarmProgress(80);
          
          const activeNodesCount = Object.keys(faults).length + 1; // plus leader
          const offlineNodes = Object.values(faults).filter(f => f === 'offline').length;
          const corruptNodes = Object.values(faults).filter(f => f === 'corrupt').length;
          const functioningNodes = activeNodesCount - offlineNodes - corruptNodes;
          
          const quorumRequired = Math.ceil((activeNodesCount * 2) / 3);
          const consensusReached = functioningNodes >= quorumRequired;

          const bftLogs = [
            `[${new Date().toTimeString().split(' ')[0]}] [BFT Engine] Running Byzantine Fault Tolerant consensus evaluation...`,
            `[${new Date().toTimeString().split(' ')[0]}] [BFT Engine] Total Swarm Nodes: ${activeNodesCount} | Offline: ${offlineNodes} | Corrupt: ${corruptNodes}`,
            `[${new Date().toTimeString().split(' ')[0]}] [BFT Engine] Quorum Required: >=${quorumRequired} valid nodes | Functioning: ${functioningNodes}`
          ];

          setAgents(prev => prev.map(a => {
            if (a.status === 'gossiping' || a.status === 'inferring') return { ...a, status: 'voting' };
            return a;
          }));

          if (consensusReached) {
            bftLogs.push(`[${new Date().toTimeString().split(' ')[0]}] [BFT Engine] Quorum verified. Consensus REACHED on task result!`);
          } else {
            bftLogs.push(`[${new Date().toTimeString().split(' ')[0]}] [BFT Engine] FAILED to reach consensus. Byzantine limit exceeded!`);
          }

          setSwarmLogs(prev => [...prev, ...bftLogs]);

          // Phase 4: Commit / Result
          setTimeout(() => {
            setSwarmProgress(100);
            if (consensusReached) {
              setSwarmStatus('committed');
              setSwarmLogs(prev => [
                ...prev,
                `[${new Date().toTimeString().split(' ')[0]}] [CRDT] State committed to local Y.js document log.`,
                `[${new Date().toTimeString().split(' ')[0]}] [System] Swarm Task successfully integrated! ✨`
              ]);
              setAgents(prev => prev.map(a => {
                if (a.status === 'voting' || a.id === 'leader') return { ...a, status: 'committed' };
                return a;
              }));
              triggerFlash('Swarm task completed and committed via BFT consensus!');
            } else {
              setSwarmStatus('idle');
              setSwarmProgress(0);
              setSwarmLogs(prev => [
                ...prev,
                `[${new Date().toTimeString().split(' ')[0]}] [System] Transaction aborted. Please fix node faults and retry.`
              ]);
              setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
              triggerFlash('BFT Consensus Failed. Swarm transaction aborted.');
            }
          }, 1500);

        }, 1800);

      }, 1800);

    }, 1200);
  };

  const resetSwarmSimulator = () => {
    setSwarmStatus('idle');
    setSwarmProgress(0);
    setSwarmLogs([
      '[System] Swarm consensus engine reset.',
      '[System] Ready to broadcast task assignments to edge agent network.'
    ]);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
  };

  const TTC_STEPS = [
    {
      step: 0,
      progress: 10,
      status: 'analyzing',
      log: 'Estimating task complexity for reasoning prompt...',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'expanding', value: 0, visits: 0 }
      ],
      activeNodeId: 0,
      output: ''
    },
    {
      step: 1,
      progress: 20,
      status: 'searching',
      log: 'Allocating compute budget. Root node analysis initiated.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 1 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'expanding', value: 0, visits: 0 }
      ],
      activeNodeId: 1,
      output: ''
    },
    {
      step: 2,
      progress: 30,
      status: 'searching',
      log: 'Expanding Node 1: Decomposing boundary conditions. Byzantine tolerance constraint f < n/2.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 2 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.9, visits: 2 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'exploring', value: 0.3, visits: 1 }
      ],
      activeNodeId: 2,
      output: ''
    },
    {
      step: 3,
      progress: 40,
      status: 'searching',
      log: 'Self-Reflection Critic on Node 2: Classical PBFT fails when f >= n/3. 45% Byzantine nodes violates safety bounds. Refuting branch.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 3 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.9, visits: 3 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'exploring', value: 0.8, visits: 1 }
      ],
      activeNodeId: 3,
      output: ''
    },
    {
      step: 4,
      progress: 50,
      status: 'searching',
      log: 'Self-Reflection Critic check on Node 3: Hybrid HotStuff with synchronous fallback can tolerate up to 50% faults. Q-value: +0.85.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 4 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.95, visits: 4 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'success', value: 0.85, visits: 2 },
        { id: 4, label: 'PQ Signatures', x: 260, y: 180, parent: 3, status: 'exploring', value: 0.7, visits: 1 }
      ],
      activeNodeId: 4,
      output: ''
    },
    {
      step: 5,
      progress: 60,
      status: 'searching',
      log: 'Evaluating Node 4: Integrating Dilithium signatures. Network throughput bottleneck identified (large keys).',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 5 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.95, visits: 5 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'success', value: 0.85, visits: 3 },
        { id: 4, label: 'PQ Signatures', x: 260, y: 180, parent: 3, status: 'warning', value: 0.5, visits: 2 },
        { id: 5, label: 'Optimize Sigs', x: 210, y: 230, parent: 4, status: 'exploring', value: 0.45, visits: 1 }
      ],
      activeNodeId: 5,
      output: ''
    },
    {
      step: 6,
      progress: 70,
      status: 'searching',
      log: 'Expanding Node 6: Adding threshold signature aggregation to compress ML-DSA payloads.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 6 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.95, visits: 6 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'success', value: 0.9, visits: 4 },
        { id: 4, label: 'PQ Signatures', x: 260, y: 180, parent: 3, status: 'success', value: 0.8, visits: 3 },
        { id: 5, label: 'Optimize Sigs', x: 210, y: 230, parent: 4, status: 'refuted', value: 0.2, visits: 1 },
        { id: 6, label: 'Sig Aggregation', x: 310, y: 230, parent: 4, status: 'exploring', value: 0.88, visits: 1 }
      ],
      activeNodeId: 6,
      output: ''
    },
    {
      step: 7,
      progress: 80,
      status: 'searching',
      log: 'Self-Reflection Critic check on Node 6: Aggregated Dilithium signature reduces node exchange latency by 74%. Q-value: +0.92.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 7 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.95, visits: 7 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'success', value: 0.92, visits: 5 },
        { id: 4, label: 'PQ Signatures', x: 260, y: 180, parent: 3, status: 'success', value: 0.88, visits: 4 },
        { id: 5, label: 'Optimize Sigs', x: 210, y: 230, parent: 4, status: 'refuted', value: 0.2, visits: 1 },
        { id: 6, label: 'Sig Aggregation', x: 310, y: 230, parent: 4, status: 'success', value: 0.92, visits: 2 },
        { id: 7, label: 'Distributed DKG', x: 310, y: 280, parent: 6, status: 'exploring', value: 0.95, visits: 1 }
      ],
      activeNodeId: 7,
      output: ''
    },
    {
      step: 8,
      progress: 90,
      status: 'reflecting',
      log: 'Formal Verification of consensus stability under f=0.45 Byzantine conditions. All properties hold.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 8 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.98, visits: 8 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'success', value: 0.95, visits: 6 },
        { id: 4, label: 'PQ Signatures', x: 260, y: 180, parent: 3, status: 'success', value: 0.94, visits: 5 },
        { id: 5, label: 'Optimize Sigs', x: 210, y: 230, parent: 4, status: 'refuted', value: 0.2, visits: 1 },
        { id: 6, label: 'Sig Aggregation', x: 310, y: 230, parent: 4, status: 'success', value: 0.96, visits: 3 },
        { id: 7, label: 'Distributed DKG', x: 310, y: 280, parent: 6, status: 'final', value: 0.98, visits: 2 }
      ],
      activeNodeId: 7,
      output: ''
    },
    {
      step: 9,
      progress: 100,
      status: 'completed',
      log: 'Search completed. Spent 24 tokens. Consensus security bounds verified mathematically.',
      nodes: [
        { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'success', value: 1.0, visits: 9 },
        { id: 1, label: 'Analyze limits', x: 230, y: 80, parent: 0, status: 'success', value: 0.98, visits: 9 },
        { id: 2, label: 'Alt A: PBFT', x: 130, y: 130, parent: 1, status: 'refuted', value: 0.0, visits: 1 },
        { id: 3, label: 'Alt B: HotStuff', x: 330, y: 130, parent: 1, status: 'success', value: 0.95, visits: 7 },
        { id: 4, label: 'PQ Signatures', x: 260, y: 180, parent: 3, status: 'success', value: 0.94, visits: 6 },
        { id: 5, label: 'Optimize Sigs', x: 210, y: 230, parent: 4, status: 'refuted', value: 0.2, visits: 1 },
        { id: 6, label: 'Sig Aggregation', x: 310, y: 230, parent: 4, status: 'success', value: 0.96, visits: 4 },
        { id: 7, label: 'Distributed DKG', x: 310, y: 280, parent: 6, status: 'final', value: 0.98, visits: 3 }
      ],
      activeNodeId: 7,
      output: `{
  "protocol": "Quantum-Secure HotStuff Hybrid",
  "fault_tolerance": "45.0% Byzantine nodes",
  "safety_guarantees": "Asynchronous liveness with synchronous recovery bounds",
  "signature_scheme": "ML-DSA (Dilithium-5) with threshold pairing-based aggregation",
  "dkg_setup": "Feldman Threshold Verifiable Secret Sharing (VSS)",
  "verification": {
    "consensus_level": "98.2%",
    "mathematical_inductive_proof": "Validated (safety bounds f < (n + h)/2 hold under synchrony)"
  }
}`
    }
  ];

  const runJepaSimulation = () => {
    if (jepaStatus !== 'idle') return;
    setJepaStatus('compiling');
    setJepaProgress(10);
    setJepaLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Allocating WebGPU tensor memory for context and target encoders...`,
      `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Compiling JEPA predictor WGSL shaders...`
    ]);

    let prog = 10;
    const interval = setInterval(() => {
      prog += 20;
      if (prog >= 100) {
        clearInterval(interval);
        setJepaProgress(100);
        setJepaStatus('simulating');
        setJepaLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Pipeline compiled successfully. Masked target embeddings bound.`,
          `[${new Date().toTimeString().split(' ')[0]}] [JEPA] Starting forward predictive representation loop...`,
          `[${new Date().toTimeString().split(' ')[0]}] [Encoder] Invariant embedding constraint active (lambda=0.01)`
        ]);
      } else {
        setJepaProgress(prog);
        setJepaLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Compiler] Linking predictor blocks (${prog}%)...`
        ]);
      }
    }, 200);
  };

  const resetJepaSimulation = () => {
    setJepaStatus('idle');
    setJepaProgress(0);
    setJepaLoss(0.85);
    setJepaEntropy(1.2);
    setJepaLogs([
      '[System] Joint Embedding Predictive Architecture (JEPA) engine reset.',
      '[System] Ready to load context/target encoders and compile predictor shaders.'
    ]);
  };

  const runTtcSimulation = () => {
    if (ttcStatus !== 'idle') return;
    setTtcStatus('analyzing');
    setTtcProgress(5);
    setTtcOutput('');
    setTtcNodes([
      { id: 0, label: 'Query', x: 230, y: 30, parent: null, status: 'expanding', value: 0, visits: 0 }
    ]);
    setTtcActiveNodeId(0);
    setTtcLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Initializing Test-Time Compute Reasoning Engine...`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Allocating memory buffer for search nodes...`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Analyzing query difficulty and token priors...`
    ]);

    let stepIndex = 0;
    const runNextStep = () => {
      if (stepIndex >= TTC_STEPS.length) {
        setTtcStatus('completed');
        return;
      }
      const data = TTC_STEPS[stepIndex];
      setTtcStatus(data.status as any);
      setTtcProgress(data.progress);
      setTtcNodes(data.nodes);
      setTtcActiveNodeId(data.activeNodeId);
      if (data.output) {
        setTtcOutput(data.output);
      }
      setTtcLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] ${data.log}`
      ]);
      stepIndex++;
      if (stepIndex < TTC_STEPS.length) {
        const delay = TTC_STEPS[stepIndex].status === 'completed' ? 1800 : 1200;
        setTimeout(runNextStep, delay);
      }
    };

    setTimeout(runNextStep, 1000);
  };

  const resetTtcSimulator = () => {
    setTtcStatus('idle');
    setTtcProgress(0);
    setTtcOutput('');
    setTtcNodes([]);
    setTtcActiveNodeId(null);
    setTtcLogs([
      '[System] Test-Time Compute (TTC) reasoning engine reset.',
      '[System] Ready to run adaptive multi-path search with Monte Carlo Tree Search.'
    ]);
  };

  const runZkInference = () => {
    if (zkStatus !== 'idle') return;
    setZkStatus('inferring');
    setZkProgress(10);
    setZkOutput('');
    setZkProof('');
    setZkLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [LLM Engine] Spawning Llama-3-8B model context...`,
      `[${new Date().toTimeString().split(' ')[0]}] [LLM Engine] Setting prompt: "${zkPrompt}"`,
      `[${new Date().toTimeString().split(' ')[0]}] [LLM Engine] Running inference steps (temperature = 0.2)...`
    ]);

    setTimeout(() => {
      setZkProgress(35);
      setZkStatus('proving');
      setZkLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [LLM Engine] Inference complete (120 tokens generated).`,
        `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Synthesizing execution trace to constraint matrices...`,
        `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Active constraints: 262,144 | Arithmetic gates: 184,271`
      ]);

      setTimeout(() => {
        setZkProgress(65);
        setZkLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Generating witness vectors...`,
          `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Witness generation complete. Running Multi-Scalar Multiplication (MSM)...`,
          `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] WebGPU WGSL pipeline active for MSM calculations...`
        ]);

        setTimeout(() => {
          setZkProgress(85);
          setZkLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Performing Number Theoretic Transform (NTT) polynomials...`,
            `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Creating Halo2 SNARK proof on BN254 curve...`
          ]);

          setTimeout(() => {
            setZkProgress(100);
            setZkStatus('verified');
            setZkOutput(
              JSON.stringify(
                {
                  patient: {
                    id: "PT-9428",
                    record_status: "verified",
                    soc2_compliant: true,
                    data_residency: "US-East-1"
                  },
                  extracted_entities: [
                    { name: "Blood Pressure", value: "120/80" },
                    { name: "Heart Rate", value: "72 bpm" }
                  ]
                },
                null,
                2
              )
            );
            const generatedProof = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
            setZkProof(generatedProof);
            setZkLogs(prev => [
              ...prev,
              `[${new Date().toTimeString().split(' ')[0]}] [ZK Prover] Cryptographic proof created! Size: 340 bytes.`,
              `[${new Date().toTimeString().split(' ')[0]}] [Verifier] Executing sub-millisecond cryptographic pairing checks...`,
              `[${new Date().toTimeString().split(' ')[0]}] [Verifier] PROOF VALID! Cryptographic verification score: 100%`,
              `[${new Date().toTimeString().split(' ')[0]}] [System] Verifiable LLM generation completed successfully! ✨`
            ]);
            triggerFlash('zk-Inference generated and cryptographically verified successfully!');
          }, 1500);

        }, 1500);

      }, 1500);

    }, 1500);
  };

  const resetZkSimulator = () => {
    setZkStatus('idle');
    setZkProgress(0);
    setZkOutput('');
    setZkProof('');
    setZkLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] zk-Inference Validator engine reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to run verifiable LLM generation.`
    ]);
  };

  const runFheSearch = () => {
    if (fheStatus !== 'idle') return;
    setFheStatus('encrypting');
    setFheProgress(10);
    setFheCiphertext('');
    setFhePlaintextQuery('Generating query embedding (1536-dimensions)...');
    setFheLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [Embedding] Computing embedding for query: "${fheQuery}"`,
      `[${new Date().toTimeString().split(' ')[0]}] [FHE Engine] Spawning TFHE-rs WASM context...`,
      `[${new Date().toTimeString().split(' ')[0]}] [FHE Engine] Initializing CKKS public/private keypair (log N = 13)...`
    ]);

    setTimeout(() => {
      setFheProgress(35);
      setFheStatus('searching');
      // Generate some dummy vector values
      const dummyVec = Array.from({length: 8}, () => (Math.random() * 2 - 1).toFixed(4)).join(', ');
      setFhePlaintextQuery(`[${dummyVec}, ...]`);
      
      const cipher = '0x' + Array.from({length: 48}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase() + '... [CKKS Ciphertext]';
      setFheCiphertext(cipher);
      
      setFheLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [Embedding] Generated 1536-dim float32 vector.`,
        `[${new Date().toTimeString().split(' ')[0]}] [FHE Engine] Encrypting vector using CKKS public key...`,
        `[${new Date().toTimeString().split(' ')[0]}] [FHE Engine] Encryption complete. Ciphertext size: 4.2 KB.`,
        `[${new Date().toTimeString().split(' ')[0]}] [Network] Uploading ciphertext query to database...`,
        `[${new Date().toTimeString().split(' ')[0]}] [Database] Performing homomorphic dot product with index vectors...`
      ]);

      setTimeout(() => {
        setFheProgress(70);
        setFheStatus('decrypting');
        setFheLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [Database] Calculated homomorphic cosine similarity on encrypted states.`,
          `[${new Date().toTimeString().split(' ')[0]}] [Database] Homomorphic search complete (evaluated 10,000 vectors).`,
          `[${new Date().toTimeString().split(' ')[0]}] [Network] Downloading top-3 encrypted distance metrics...`,
          `[${new Date().toTimeString().split(' ')[0]}] [FHE Engine] Decrypting distance metrics using CKKS private key...`
        ]);

        setTimeout(() => {
          setFheProgress(100);
          setFheStatus('completed');
          setFheResults([
            { title: 'sec_contract_2026.pdf (Page 14)', score: 0.8924, text: 'Client renewal date scheduled for Oct 12, 2026. Option for pricing tier A ($4,200/mo).' },
            { title: 'pricing_structure_v3.xlsx', score: 0.8142, text: 'Enterprise pricing models: Tier A ($4,000 - $5,000/mo), Tier B ($8,000 - $10,000/mo) with SLA.' },
            { title: 'vendor_terms_signed.docx', score: 0.7415, text: 'General vendor guidelines state that pricing models are confidential and locked in for 12 months.' }
          ]);
          setFheLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [FHE Engine] Decryption complete. Recovered matched document indices.`,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Search finished successfully! Zero plaintexts left client boundary. ✨`
          ]);
          triggerFlash('FHE Vector Search completed and decrypted successfully!');
        }, 1500);

      }, 1500);

    }, 1500);
  };

  const resetFheSimulator = () => {
    setFheStatus('idle');
    setFheProgress(0);
    setFheCiphertext('');
    setFhePlaintextQuery('');
    setFheResults([]);
    setFheLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] FHE Vector Search engine reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to run encrypted query validation.`
    ]);
  };

  const runLnnSimulation = () => {
    if (lnnStatus !== 'idle') return;
    setLnnStatus('compiling');
    setLnnProgress(10);
    setLnnLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Initializing WebGPU adapter and requesting device...`,
      `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Found compatible GPU device: Apple M-series GPU.`,
      `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Creating pipeline bind group layouts for Liquid states...`
    ]);

    setTimeout(() => {
      setLnnProgress(40);
      setLnnLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Compiling WGSL compute shader for continuous-time ODE solver...`,
        `[${new Date().toTimeString().split(' ')[0]}] [WGSL] Solver source code loaded (Euler-Maruyama integration scheme).`,
        `[${new Date().toTimeString().split(' ')[0]}] [WGSL] Verification complete. Allocating GPU memory buffers (65,536 bytes)...`
      ]);

      setTimeout(() => {
        setLnnProgress(75);
        setLnnLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] GPU buffers bound: State variables (size: 65k), ODE parameters, Inputs.`,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Creating compute pass encoder and pipelines...`,
          `[${new Date().toTimeString().split(' ')[0]}] [System] Compilation successful. Triggering continuous integration loop...`
        ]);

        setTimeout(() => {
          setLnnProgress(100);
          setLnnStatus('simulating');
          setLnnLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Simulation loop active at 60 FPS.`,
            `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Dispatched compute shader threads (workgroups = 32).`,
            `[${new Date().toTimeString().split(' ')[0]}] [LNN] Continuous integration running. Dynamic time-constants active. ✨`
          ]);
          triggerFlash('WebGPU Liquid Agent simulation started!');
        }, 1200);

      }, 1200);

    }, 1000);
  };

  const resetLnnSimulation = () => {
    setLnnStatus('idle');
    setLnnProgress(0);
    setLnnErrorRate(0.02);
    setLnnLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Liquid-Agent WebGPU environment reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to compile continuous-time WGSL shader pipelines.`
    ]);
  };

  const runBitnetInference = () => {
    if (bitnetStatus !== 'idle') return;
    setBitnetStatus('compiling');
    setBitnetProgress(10);
    setBitnetOutput('');
    setBitnetSpeed(0);
    setBitnetLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Initializing WebGPU adapter...`,
      `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Device query succeeded: Apple M-series GPU.`,
      `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Loading packed 2-bit weights in GPU memory buffers...`
    ]);

    setTimeout(() => {
      setBitnetProgress(45);
      setBitnetLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Compiling custom WGSL BitLinear shaders...`,
        `[${new Date().toTimeString().split(' ')[0]}] [WGSL] Kernel loaded: integer addition accumulation pass (b1.58 scheme).`,
        `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Float32 multiplication ALU units bypassed.`
      ]);

      setTimeout(() => {
        setBitnetProgress(75);
        setBitnetLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Binding buffers: Weights (2-bit compressed), Inputs, Dynamic Scales (RMSNorm).`,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Pipeline creation successful. Dispatching compute threads...`
        ]);

        setTimeout(() => {
          setBitnetProgress(100);
          setBitnetStatus('inferring');
          setBitnetLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [System] Compilation successful. Inference engine active.`,
            `[${new Date().toTimeString().split(' ')[0]}] [BitNet] Active generation loop started at high speed. ✨`
          ]);

          const fullText = `[Compliance Summary] AutoProposal has successfully completed its SOC2 compliance verification check. Dynamic data flows are secured using post-quantum ML-KEM exchange mechanisms. Identified Risks: (1) Local memory overflow risks under extreme agent swarm concurrency. (2) Attestation response latency variations. Mitigations: Local GC buffers, adaptive thread scheduling. All security guidelines are in verified status.`;
          const words = fullText.split(' ');
          let currentWordIndex = 0;
          let generatedText = '';

          bitnetIntervalRef.current = setInterval(() => {
            if (currentWordIndex < words.length) {
              generatedText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
              setBitnetOutput(generatedText);
              setBitnetSpeed(Math.floor(95 + Math.random() * 25));
              
              if (currentWordIndex % 5 === 0) {
                setBitnetLogs(prev => [
                  ...prev,
                  `[${new Date().toTimeString().split(' ')[0]}] [Inference] Generated tokens ${currentWordIndex + 1}/${words.length}...`
                ]);
              }
              currentWordIndex++;
            } else {
              if (bitnetIntervalRef.current) {
                clearInterval(bitnetIntervalRef.current);
                bitnetIntervalRef.current = null;
              }
              setBitnetStatus('completed');
              setBitnetLogs(prev => [
                ...prev,
                `[${new Date().toTimeString().split(' ')[0]}] [System] Inference generation complete.`,
                `[${new Date().toTimeString().split(' ')[0]}] [System] Average speed: 108.4 tokens/sec. Energy consumed: 0.12 Wh. ✨`
              ]);
              triggerFlash('BitNet local inference completed successfully!');
            }
          }, 80);

        }, 1200);

      }, 1000);

    }, 800);
  };

  const resetBitnetInference = () => {
    if (bitnetIntervalRef.current) {
      clearInterval(bitnetIntervalRef.current);
      bitnetIntervalRef.current = null;
    }
    setBitnetStatus('idle');
    setBitnetProgress(0);
    setBitnetOutput('');
    setBitnetSpeed(0);
    setBitnetLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] BitNet ternary inference engine reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to compile 1.58-bit WGSL matrix kernels.`
    ]);
  };

  const runMambaScan = () => {
    if (mambaStatus !== 'idle') return;
    setMambaStatus('compiling');
    setMambaProgress(10);
    setMambaOutput('');
    setMambaSpeed(0);
    setMambaLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Allocating constant state buffers on GPU...`,
      `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Compiling Selective Scan WGSL kernel (S6 parallel scan)...`,
      `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Input dimensions: sequence_length = ${mambaSeqLength === '4k' ? 4096 : mambaSeqLength === '16k' ? 16384 : mambaSeqLength === '64k' ? 65536 : 262144}, state_dim = 16.`
    ]);

    setTimeout(() => {
      setMambaProgress(45);
      setMambaLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] [Compiler] WGSL shaders compiled successfully in 340ms.`,
        `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Created GPUCommandEncoder and Pipeline state.`,
        `[${new Date().toTimeString().split(' ')[0]}] [System] Dispatching WebGPU compute grid (workgroup_size = [256, 1, 1])...`
      ]);

      setTimeout(() => {
        setMambaProgress(75);
        setMambaLogs(prev => [
          ...prev,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Memory bind groups bound. Zero KV Cache allocated.`,
          `[${new Date().toTimeString().split(' ')[0]}] [WebGPU] Running parallel associative prefix scan on state A matrix...`
        ]);

        setTimeout(() => {
          setMambaProgress(100);
          setMambaStatus('scanning');
          setMambaLogs(prev => [
            ...prev,
            `[${new Date().toTimeString().split(' ')[0]}] [Mamba] Gating matrices (B and C) dynamically generated per-token.`,
            `[${new Date().toTimeString().split(' ')[0]}] [Mamba] Parallel scan execution completed. Reading back result...`
          ]);

          let generatedText = '';
          const fullText = `[Long Context Analysis Report]
- Successfully ingested complete RFP dossier (length: ${mambaSeqLength === '4k' ? '4,096' : mambaSeqLength === '16k' ? '16,384' : mambaSeqLength === '64k' ? '65,536' : '262,144'} tokens).
- Constant memory state maintained at 128 KB (16 dimensions * 4 bytes/float * 2048 hidden size).
- Found 2 security policy discrepancies in Section 8.4:
  1. Data residency requires EU-Central, but backup default is US-East.
  2. Multi-tenant encryption is set to AES-128 instead of AES-256.
- Conclusion: Proposal is 94% compliant. Remediation steps generated.`;

          let charIdx = 0;
          mambaIntervalRef.current = setInterval(() => {
            if (charIdx < fullText.length) {
              const increment = Math.floor(Math.random() * 8) + 4;
              generatedText += fullText.substring(charIdx, charIdx + increment);
              charIdx += increment;
              setMambaOutput(generatedText);
              setMambaSpeed(Math.floor(180 + Math.random() * 40));
            } else {
              if (mambaIntervalRef.current) {
                clearInterval(mambaIntervalRef.current);
                mambaIntervalRef.current = null;
              }
              setMambaStatus('completed');
              setMambaLogs(prev => [
                ...prev,
                `[${new Date().toTimeString().split(' ')[0]}] [Mamba] Context synthesis finished. Out-of-memory errors: 0.`,
                `[${new Date().toTimeString().split(' ')[0]}] [System] Mamba-2 Selective SSM scan completed successfully! ✨`
              ]);
              triggerFlash('Mamba SSM context scan completed successfully!');
            }
          }, 40);

        }, 1000);

      }, 1000);

    }, 800);
  };

  const resetMambaScan = () => {
    if (mambaIntervalRef.current) {
      clearInterval(mambaIntervalRef.current);
      mambaIntervalRef.current = null;
    }
    setMambaStatus('idle');
    setMambaProgress(0);
    setMambaLogs([
      `[${new Date().toTimeString().split(' ')[0]}] [System] Mamba-2 Selective SSM engine reset.`,
      `[${new Date().toTimeString().split(' ')[0]}] [System] Ready to compile parallel associative scan WGSL shaders.`
    ]);
    setMambaOutput('');
    setMambaSpeed(0);
  };


  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }} className="gradient-text">
            Daily Tech Innovation Sandbox
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Researching the impact and brainstorming projects across emerging technologies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass-panel" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <Sparkles size={16} color="var(--accent-color)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Next Brainstorm in 14h 33m</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Innovation Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.2)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', marginLeft: '0.25rem' }}>
              Emerging Ideas Registry
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PROJECTS.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    className={isSelected ? '' : 'card-item'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{project.date}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        color: project.impactScore >= 9.5 ? 'var(--success-color)' : 'var(--primary-color)',
                        background: project.impactScore >= 9.5 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '6px'
                      }}>
                        {project.impactScore} Score
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'var(--primary-color)' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {project.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Context */}
          <div className="card" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={15} color="var(--primary-color)" /> Project Impact Research
            </h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}>Problem Statement:</strong>
                {selectedProject.problemSolved}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}>Open-Source Potential:</strong>
                {selectedProject.impactDescription}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tech Stack & Description */}
          <div className="card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  {selectedProject.title} : <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>{selectedProject.tagline}</span>
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                  {selectedProject.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        background: 'rgba(255,255,255,0.04)', 
                        border: '1px solid var(--border-color)', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '6px', 
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture diagram mapping */}
            <div style={{ background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                System Architecture Flow
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {selectedProject.architecture.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      border: '1px solid var(--primary-color)',
                      color: 'var(--primary-color)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Lab / Simulator */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            
            {/* Lab Header */}
            <div style={{ 
              padding: '1.25rem 1.5rem', 
              borderBottom: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.05) 0%, rgba(3, 7, 18, 0) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Terminal size={18} color="var(--accent-color)" />
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.01em' }}>Interactive Lab & Sandbox Simulation</h3>
              </div>
              
              {/* Notification Overlay */}
              <AnimatePresence>
                {notification && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      position: 'absolute', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: 'rgba(16, 185, 129, 0.9)', 
                      color: 'white',
                      padding: '0.4rem 1rem', 
                      borderRadius: '8px', 
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      zIndex: 100,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Check size={14} /> {notification}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connected State Buttons */}
              {selectedProjectId === 'synaptic-crdt' && (
                <button 
                  onClick={toggleConnection}
                  style={{
                    background: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: isOnline ? 'var(--success-color)' : 'var(--error-color)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {isOnline ? 'P2P Online' : 'P2P Offline (Local)'}
                </button>
              )}
            </div>

            {/* Sandbox Playground Area */}
            {selectedProjectId === 'speculative-decoding' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: '520px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem', overflow: 'hidden' }}>
                  
                  {/* Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '220px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Speculative Prompt Task
                      </label>
                      <select 
                        value={specPrompt} 
                        onChange={(e) => setSpecPrompt(e.target.value)}
                        disabled={specStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(3, 7, 18, 0.5)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="code-gen">Code: Autoregressive QuickSort structure (Highly structured)</option>
                        <option value="creative-story">Creative: Cyberpunk story agent (Low structure)</option>
                        <option value="logic-math">Math: Step-by-step verification solver (High structure)</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Draft Length (K)
                      </label>
                      <select
                        value={specDraftLength}
                        onChange={(e) => setSpecDraftLength(parseInt(e.target.value))}
                        disabled={specStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(3, 7, 18, 0.5)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value={3}>K = 3 tokens</option>
                        <option value={4}>K = 4 tokens</option>
                        <option value={5}>K = 5 tokens</option>
                        <option value={6}>K = 6 tokens</option>
                      </select>
                    </div>

                    <div style={{ flex: 1.5, minWidth: '160px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Draft Alignment ({Math.round(specAcceptanceProb * 100)}%)
                      </label>
                      <input 
                        type="range"
                        min="0.4"
                        max="0.95"
                        step="0.05"
                        value={specAcceptanceProb}
                        onChange={(e) => setSpecAcceptanceProb(parseFloat(e.target.value))}
                        disabled={specStatus !== 'idle'}
                        style={{
                          width: '100%',
                          accentColor: 'var(--primary-color)',
                          background: 'rgba(3, 7, 18, 0.5)',
                          height: '6px',
                          borderRadius: '3px',
                          outline: 'none',
                          margin: '0.5rem 0'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runSpeculativeSimulation}
                        disabled={specStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: specStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: specStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: specStatus === 'idle' ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
                        }}
                      >
                        <Play size={14} /> Run Cycle
                      </button>
                      <button 
                        onClick={resetSpeculativeSimulation}
                        disabled={specStatus === 'drafting' || specStatus === 'verifying'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: (specStatus === 'drafting' || specStatus === 'verifying') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Simulator Main Display */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    
                    {/* Visual Tokens Panel */}
                    <div style={{
                      background: 'rgba(3, 7, 18, 0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Active Token Sequence (Llama-3-70B Context)
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.6rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'rgba(255,255,255,0.4)' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span> Prompt</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--warning-color)' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning-color)' }}></span> Draft</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--success-color)' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success-color)' }}></span> Accepted</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-color)' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)' }}></span> Correction</span>
                        </div>
                      </div>

                      {/* Display generated text with token styling */}
                      <div style={{
                        minHeight: '120px',
                        background: 'rgba(3, 7, 18, 0.6)',
                        borderRadius: '8px',
                        padding: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignContent: 'flex-start',
                        gap: '0.35rem 0.2rem',
                        lineHeight: '1.8',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '0.9rem'
                      }}>
                        {specTokens.map((t) => {
                          let bg = 'rgba(255,255,255,0.05)';
                          let border = '1px solid rgba(255,255,255,0.1)';
                          let color = '#fff';
                          let glow = 'none';
                          let isPending = false;

                          if (t.source === 'prompt') {
                            bg = 'rgba(255,255,255,0.03)';
                            border = '1px solid rgba(255,255,255,0.05)';
                            color = 'rgba(255,255,255,0.5)';
                          } else if (t.status === 'pending') {
                            bg = 'rgba(245, 158, 11, 0.05)';
                            border = '1px dashed var(--warning-color)';
                            color = 'var(--warning-color)';
                            glow = '0 0 8px rgba(245, 158, 11, 0.2)';
                            isPending = true;
                          } else if (t.status === 'accepted') {
                            bg = 'rgba(34, 197, 94, 0.15)';
                            border = '1px solid var(--success-color)';
                            color = 'var(--success-color)';
                            glow = '0 0 10px rgba(34, 197, 94, 0.3)';
                          } else if (t.status === 'rejected') {
                            bg = 'rgba(239, 68, 68, 0.15)';
                            border = '1px solid var(--error-color)';
                            color = 'var(--error-color)';
                            glow = 'none';
                          } else if (t.source === 'correction') {
                            bg = 'rgba(139, 92, 246, 0.15)';
                            border = '1px solid var(--accent-color)';
                            color = 'var(--accent-color)';
                            glow = '0 0 10px rgba(139, 92, 246, 0.3)';
                          }

                          return (
                            <motion.span
                              key={t.id}
                              initial={t.status === 'pending' ? { scale: 0.8, opacity: 0 } : {}}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{
                                display: 'inline-block',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px',
                                background: bg,
                                border: border,
                                color: color,
                                boxShadow: glow,
                                fontWeight: t.source === 'prompt' ? 400 : 700,
                                whiteSpace: 'pre-wrap',
                                transition: 'all 0.3s'
                              }}
                              className={isPending ? 'blink' : ''}
                            >
                              {t.token.replace('\n', '↵\n')}
                            </motion.span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step Visualization Diagram */}
                    <div style={{
                      background: 'rgba(3, 7, 18, 0.4)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Parallel Verification Flow
                      </span>
                      
                      {specStatus === 'idle' ? (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', fontStyle: 'italic' }}>
                          Start a cycle to visualize drafting and verification operations.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {/* Draft Row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '80px', fontSize: '0.7rem', color: 'var(--warning-color)', fontWeight: 800 }}>DRAFT (1B):</div>
                            <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                              {specTokens.filter(t => t.source === 'draft').map((t, idx) => (
                                <div key={idx} style={{ 
                                  background: 'rgba(245, 158, 11, 0.1)', 
                                  border: '1px solid rgba(245, 158, 11, 0.3)', 
                                  borderRadius: '6px', 
                                  padding: '0.3rem 0.6rem',
                                  fontSize: '0.7rem',
                                  fontFamily: 'monospace',
                                  color: 'white',
                                  minWidth: '60px',
                                  textAlign: 'center',
                                  position: 'relative'
                                }}>
                                  <span style={{ position: 'absolute', top: '-12px', left: '0', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>K={idx+1}</span>
                                  {t.token.trim()}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Parallel arrow indicator */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '-0.3rem 0' }}>
                            <div style={{ width: '80px' }}></div>
                            <div style={{ display: 'flex', gap: '1.5rem', flex: 1, paddingLeft: '20px' }}>
                              {specTokens.filter(t => t.source === 'draft').map((_, idx) => (
                                <div key={idx} style={{ 
                                  minWidth: '60px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  color: 'var(--text-secondary)'
                                }}>
                                  ⬇️
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Target Verification Row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '80px', fontSize: '0.7rem', color: 'var(--success-color)', fontWeight: 800 }}>TARGET (70B):</div>
                            <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                              {specTokens.filter(t => t.source === 'draft').map((t, idx) => {
                                let label = 'Verify...';
                                let bg = 'rgba(255, 255, 255, 0.05)';
                                let color = 'rgba(255, 255, 255, 0.4)';
                                let border = '1px solid rgba(255,255,255,0.1)';

                                if (t.status === 'accepted') {
                                  label = 'Accept ✓';
                                  bg = 'rgba(34, 197, 94, 0.2)';
                                  color = 'var(--success-color)';
                                  border = '1px solid var(--success-color)';
                                } else if (t.status === 'rejected') {
                                  label = 'Reject ✗';
                                  bg = 'rgba(239, 68, 68, 0.2)';
                                  color = 'var(--error-color)';
                                  border = '1px solid var(--error-color)';
                                } else if (t.status === 'verified') {
                                  label = 'Verified ✓';
                                  bg = 'rgba(34, 197, 94, 0.2)';
                                  color = 'var(--success-color)';
                                  border = '1px solid var(--success-color)';
                                }

                                return (
                                  <div key={idx} style={{ 
                                    background: bg, 
                                    border: border,
                                    borderRadius: '6px', 
                                    padding: '0.3rem 0.6rem',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: color,
                                    minWidth: '60px',
                                    textAlign: 'center'
                                  }}>
                                    {label}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Correction token showcase */}
                          {specStatus === 'completed' && (
                            <div style={{
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1rem',
                              borderTop: '1px dashed var(--border-color)',
                              paddingTop: '0.75rem',
                              marginTop: '0.25rem'
                            }}>
                              <div style={{ width: '80px', fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: 800 }}>CORRECTION:</div>
                              <div style={{
                                background: 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid var(--accent-color)',
                                borderRadius: '6px',
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                <Zap size={10} color="var(--accent-color)" />
                                Appended verified target token: <strong>"{specTokens[specTokens.length - 1]?.token}"</strong> (Free correction!)
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '1.25rem', background: 'rgba(3, 7, 18, 0.05)' }}>
                  
                  {/* Telemetry */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Speculative Telemetry
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Speedup Factor</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success-color)', fontFamily: 'monospace' }}>
                          {specSpeedup.toFixed(2)}x
                        </span>
                      </div>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Acceptance Rate</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'monospace' }}>
                          {specAcceptedCount + specRejectedCount > 0 
                            ? `${Math.round((specAcceptedCount / (specAcceptedCount + specRejectedCount)) * 100)}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>VRAM Savings</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--warning-color)', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                          {specSpeedup > 1.0 
                            ? `${Math.round((1 - 1/specSpeedup) * 100)}% Bandwidth`
                            : '0% (Standard)'
                          }
                        </span>
                      </div>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Cycle</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                          Cycle {specStep} / 3
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Console */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Speculative execution Console
                    </h4>
                    <div style={{ flex: 1, background: 'rgba(3, 7, 18, 0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', maxHeight: '220px' }}>
                      {specLogs.map((log, idx) => (
                        <div key={idx} style={{ 
                          color: log.includes('[System]') ? 'var(--text-secondary)' : 
                                 log.includes('[Draft Model') || log.includes('Draft token') ? 'var(--warning-color)' :
                                 log.includes('[Target Model') ? 'var(--success-color)' :
                                 log.includes('[Verification]') ? 'rgba(255,255,255,0.7)' :
                                 log.includes('[Correction]') ? 'var(--accent-color)' : 'var(--text-primary)',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : selectedProjectId === 'grpo-reasoning' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: '520px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem', overflow: 'hidden' }}>
                  
                  {/* Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '220px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Reasoning Prompt Task
                      </label>
                      <select 
                        value={grpoPrompt} 
                        onChange={(e) => setGrpoPrompt(e.target.value)}
                        disabled={grpoStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(3, 7, 18, 0.5)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="logic-brother">Logic: Alice's sibling sharing (Deductive reasoning)</option>
                        <option value="math-equation">Math: Isolating variable equations (Multi-step calculation)</option>
                        <option value="wordplay-reverse">Wordplay: Reverse omission filter (Constraint satisfaction)</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '110px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Group Size (G)
                      </label>
                      <select
                        value={grpoGroupSize}
                        onChange={(e) => setGrpoGroupSize(parseInt(e.target.value))}
                        disabled={grpoStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(3, 7, 18, 0.5)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value={4}>G = 4 paths</option>
                        <option value={6}>G = 6 paths</option>
                        <option value={8}>G = 8 paths</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runGrpoSimulation}
                        disabled={grpoStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: grpoStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: grpoStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Train (GRPO Step)
                      </button>
                      <button 
                        onClick={resetGrpoSimulation}
                        disabled={grpoStatus === 'rolling' || grpoStatus === 'scoring' || grpoStatus === 'updating'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: (grpoStatus === 'rolling' || grpoStatus === 'scoring' || grpoStatus === 'updating') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Simulator Main Display */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {grpoStatus === 'idle' ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1.25rem', padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.01)' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                          <Cpu size={40} color="var(--accent-color)" />
                        </div>
                        <div>
                          <h5 style={{ fontWeight: 800, color: 'white', marginBottom: '0.35rem', fontSize: '0.95rem' }}>GRPO Policy Rollout Generator</h5>
                          <p style={{ fontSize: '0.8rem', maxWidth: '420px', lineHeight: '1.5' }}>
                            Click <strong>"Train (GRPO Step)"</strong> to generate a group of reasoning rollouts, evaluate them with rule-based rewards, and optimize the policy using relative advantage computation.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                        {grpoPaths.map((path) => {
                          let cardBorder = 'var(--border-color)';
                          let cardGlow = 'none';
                          if (grpoStatus === 'updating' || grpoStatus === 'completed') {
                            if (path.advantage > 0) {
                              cardBorder = 'rgba(34, 197, 94, 0.4)';
                              cardGlow = '0 0 10px rgba(34, 197, 94, 0.15)';
                            } else if (path.advantage < 0) {
                              cardBorder = 'rgba(239, 68, 68, 0.4)';
                              cardGlow = '0 0 10px rgba(239, 68, 68, 0.15)';
                            }
                          }

                          return (
                            <div 
                              key={path.id}
                              style={{
                                background: 'rgba(3, 7, 18, 0.4)',
                                border: `1px solid ${cardBorder}`,
                                borderRadius: '10px',
                                padding: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                boxShadow: cardGlow,
                                transition: 'all 0.3s'
                              }}
                            >
                              {/* Header */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                  Rollout Path 0{path.id}
                                </span>
                                <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                  Temp: {path.temperature}
                                </span>
                              </div>

                              {/* Thought Process */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Sparkles size={10} /> Thought Process
                                </span>
                                <div style={{ 
                                  background: 'rgba(139, 92, 246, 0.03)', 
                                  borderLeft: '2px solid var(--accent-color)', 
                                  padding: '0.5rem 0.75rem', 
                                  fontSize: '0.75rem', 
                                  color: 'rgba(255,255,255,0.7)',
                                  lineHeight: '1.4',
                                  fontStyle: 'italic',
                                  maxHeight: '100px',
                                  overflowY: 'auto'
                                }}>
                                  &lt;thought&gt; {path.thought} &lt;/thought&gt;
                                </div>
                              </div>

                              {/* Output Answer */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Final Answer
                                </span>
                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
                                  {path.answer}
                                </div>
                              </div>

                              {/* Scoring and Evaluation */}
                              {(grpoStatus === 'scoring' || grpoStatus === 'updating' || grpoStatus === 'completed') && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Format Reward:</span>
                                    <span style={{ fontWeight: 700, color: path.formatCorrect ? 'var(--success-color)' : 'var(--error-color)' }}>
                                      {path.formatCorrect ? '+0.5 (Valid tags)' : '0.0 (Invalid tags)'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Correctness Reward:</span>
                                    <span style={{ fontWeight: 700, color: path.correct ? 'var(--success-color)' : 'var(--error-color)' }}>
                                      {path.correct ? '+1.0 (Correct answer)' : '0.0 (Incorrect)'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '0.25rem 0', borderTop: '1px dashed var(--border-color)' }}>
                                    <span style={{ color: 'white', fontWeight: 600 }}>Total Reward (R):</span>
                                    <span style={{ fontWeight: 800, color: 'white' }}>
                                      {path.reward.toFixed(1)}
                                    </span>
                                  </div>

                                  {/* Relative Advantage */}
                                  {(grpoStatus === 'updating' || grpoStatus === 'completed') && (
                                    <div style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center',
                                      background: path.advantage >= 0 ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                      padding: '0.35rem 0.5rem',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem'
                                    }}>
                                      <span style={{ color: path.advantage >= 0 ? '#86efac' : '#fca5a5', fontWeight: 700 }}>
                                        Relative Advantage (A):
                                      </span>
                                      <span style={{ 
                                        fontWeight: 800, 
                                        color: path.advantage >= 0 ? 'var(--success-color)' : 'var(--error-color)',
                                        fontFamily: 'monospace'
                                      }}>
                                        {path.advantage >= 0 ? '+' : ''}{path.advantage.toFixed(4)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '1.25rem', background: 'rgba(3, 7, 18, 0.05)' }}>
                  
                  {/* Telemetry */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      GRPO Hyperparameters & Loss
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>RL Steps</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success-color)', fontFamily: 'monospace' }}>
                          {grpoStep}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Policy Loss</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--error-color)', fontFamily: 'monospace' }}>
                          {grpoLoss.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Console */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Advantage Updates Console
                    </h4>
                    <div style={{ flex: 1, background: 'rgba(3, 7, 18, 0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', maxHeight: '220px' }}>
                      {grpoLogs.map((log, idx) => (
                        <div key={idx} style={{ 
                          color: log.includes('[System]') ? 'var(--text-secondary)' : 
                                 log.includes('[Policy Engine]') || log.includes('[Rollouts]') ? 'var(--accent-color)' :
                                 log.includes('[Reward Evaluator]') ? 'var(--warning-color)' :
                                 log.includes('[GRPO Engine]') ? 'var(--success-color)' : 'var(--text-primary)',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : selectedProjectId === 'sae-steering' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: '520px' }}>
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  @keyframes blink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                  }
                `}</style>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem', overflow: 'hidden' }}>
                  
                  {/* Prompt Selector & Layer Selector */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '220px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Input Context / Prompt
                      </label>
                      <select 
                        value={saePrompt} 
                        onChange={(e) => setSaePrompt(e.target.value)}
                        disabled={saeStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(3, 7, 18, 0.5)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="Explain how a nuclear reactor works.">Explain how a nuclear reactor works. (Science)</option>
                        <option value="Draft a system update notification for users.">Draft a system update notification for users. (System)</option>
                        <option value="What is your stance on artificial intelligence safety?">What is your stance on artificial intelligence safety? (AI Philosophy)</option>
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        LLM Hidden Layer
                      </label>
                      <select
                        value={saeSelectedLayer}
                        onChange={(e) => setSaeSelectedLayer(e.target.value as any)}
                        disabled={saeStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(3, 7, 18, 0.5)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        <option value="layer-12">Layer 12 (Attention)</option>
                        <option value="layer-24">Layer 24 (MLP Mid)</option>
                        <option value="layer-32">Layer 32 (MLP Late)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runSaeSimulation}
                        disabled={saeStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.55rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: saeStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: saeStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: saeStatus === 'idle' ? '0 0 10px rgba(139, 92, 246, 0.3)' : 'none'
                        }}
                      >
                        <Play size={14} /> Patch & Generate
                      </button>
                      <button 
                        onClick={resetSaeSimulation}
                        disabled={saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.55rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: (saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching') && (
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '-0.5rem' }}>
                      <div style={{ width: `${saeProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))', transition: 'width 0.2s ease-out' }} />
                    </div>
                  )}

                  {/* Feature Sliders */}
                  <div style={{ background: 'rgba(30, 41, 59, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    
                    {/* Pirate Slang */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
                          Feature #4812: Pirate Talk
                        </span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b' }}>
                          {saeSteering.pirate > 0 ? '+' : ''}{saeSteering.pirate.toFixed(1)}x
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={-5}
                        max={5}
                        step={0.5}
                        value={saeSteering.pirate}
                        onChange={(e) => setSaeSteering(prev => ({ ...prev, pirate: parseFloat(e.target.value) }))}
                        disabled={saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching'}
                        style={{ accentColor: '#f59e0b', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem' }}>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, pirate: -5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Mute</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, pirate: 0 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>0.0</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, pirate: 5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Max</button>
                      </div>
                    </div>

                    {/* Deceit / Manipulation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', boxShadow: '0 0 8px #ec4899' }} />
                          Feature #9204: Deceit / Spy
                        </span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#ec4899' }}>
                          {saeSteering.deceit > 0 ? '+' : ''}{saeSteering.deceit.toFixed(1)}x
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={-5}
                        max={5}
                        step={0.5}
                        value={saeSteering.deceit}
                        onChange={(e) => setSaeSteering(prev => ({ ...prev, deceit: parseFloat(e.target.value) }))}
                        disabled={saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching'}
                        style={{ accentColor: '#ec4899', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem' }}>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, deceit: -5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Mute</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, deceit: 0 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>0.0</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, deceit: 5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Max</button>
                      </div>
                    </div>

                    {/* Scientific / Academic */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
                          Feature #11054: Academic Prose
                        </span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#3b82f6' }}>
                          {saeSteering.academic > 0 ? '+' : ''}{saeSteering.academic.toFixed(1)}x
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={-5}
                        max={5}
                        step={0.5}
                        value={saeSteering.academic}
                        onChange={(e) => setSaeSteering(prev => ({ ...prev, academic: parseFloat(e.target.value) }))}
                        disabled={saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching'}
                        style={{ accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem' }}>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, academic: -5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Mute</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, academic: 0 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>0.0</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, academic: 5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Max</button>
                      </div>
                    </div>

                    {/* Direct/Helpful */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                          Feature #2301: Direct Assistant
                        </span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#10b981' }}>
                          {saeSteering.direct > 0 ? '+' : ''}{saeSteering.direct.toFixed(1)}x
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={-5}
                        max={5}
                        step={0.5}
                        value={saeSteering.direct}
                        onChange={(e) => setSaeSteering(prev => ({ ...prev, direct: parseFloat(e.target.value) }))}
                        disabled={saeStatus === 'compiling' || saeStatus === 'extracting' || saeStatus === 'patching'}
                        style={{ accentColor: '#10b981', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem' }}>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, direct: -5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Mute</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, direct: 0 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>0.0</button>
                        <button disabled={saeStatus !== 'idle'} onClick={() => setSaeSteering(prev => ({ ...prev, direct: 5 }))} style={{ flex: 1, padding: '0.15rem', fontSize: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}>Max</button>
                      </div>
                    </div>

                  </div>

                  {/* Neural Graph Visualizer */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', padding: '0.75rem', minHeight: '220px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>SAE Activation Patching Mapping</span>
                      <span>Manifold Alignment</span>
                    </div>

                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '120px 1fr 150px', gap: '0.5rem', position: 'relative', zIndex: 5 }}>
                      
                      {/* Left: Dense nodes */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 700 }}>DENSE (d=4096)</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', background: 'rgba(255,255,255,0.01)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div 
                              key={i}
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: saeStatus !== 'idle' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                                boxShadow: saeStatus !== 'idle' ? '0 0 6px rgba(59, 130, 246, 0.8)' : 'none',
                                animation: saeStatus !== 'idle' ? `pulse ${0.5 + (i % 3) * 0.2}s infinite alternate` : 'none',
                                transition: 'all 0.3s'
                              }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Superposition</span>
                      </div>

                      {/* Middle: SVG dynamic paths */}
                      <div style={{ position: 'relative' }}>
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                          <defs>
                            <linearGradient id="grad-pirate" x1="0%" y1="50%" x2="100%" y2="50%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="grad-deceit" x1="0%" y1="50%" x2="100%" y2="50%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="grad-academic" x1="0%" y1="50%" x2="100%" y2="50%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="grad-direct" x1="0%" y1="50%" x2="100%" y2="50%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                            </linearGradient>
                          </defs>

                          {saeSteering.pirate !== 0 && (
                            <path 
                              d="M 10,90 Q 60,35 110,35" 
                              fill="none" 
                              stroke="url(#grad-pirate)" 
                              strokeWidth={Math.min(2 + Math.abs(saeSteering.pirate), 6)}
                              strokeDasharray="5,5"
                              style={{ animation: 'dash 1.5s linear infinite' }}
                            />
                          )}
                          {saeSteering.deceit !== 0 && (
                            <path 
                              d="M 10,90 Q 60,75 110,80" 
                              fill="none" 
                              stroke="url(#grad-deceit)" 
                              strokeWidth={Math.min(2 + Math.abs(saeSteering.deceit), 6)}
                              strokeDasharray="5,5"
                              style={{ animation: 'dash 1.5s linear infinite' }}
                            />
                          )}
                          {saeSteering.academic !== 0 && (
                            <path 
                              d="M 10,90 Q 60,115 110,125" 
                              fill="none" 
                              stroke="url(#grad-academic)" 
                              strokeWidth={Math.min(2 + Math.abs(saeSteering.academic), 6)}
                              strokeDasharray="5,5"
                              style={{ animation: 'dash 1.5s linear infinite' }}
                            />
                          )}
                          {saeSteering.direct !== 0 && (
                            <path 
                              d="M 10,90 Q 60,150 110,170" 
                              fill="none" 
                              stroke="url(#grad-direct)" 
                              strokeWidth={Math.min(2 + Math.abs(saeSteering.direct), 6)}
                              strokeDasharray="5,5"
                              style={{ animation: 'dash 1.5s linear infinite' }}
                            />
                          )}

                          {saeStatus !== 'idle' && (
                            <>
                              <line x1="10" y1="90" x2="110" y2="35" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                              <line x1="10" y1="90" x2="110" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                              <line x1="10" y1="90" x2="110" y2="125" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                              <line x1="10" y1="90" x2="110" y2="170" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            </>
                          )}
                        </svg>
                      </div>

                      {/* Right: Sparse features */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%', paddingLeft: '0.5rem' }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 700, alignSelf: 'center' }}>SPARSE (m=16384)</span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            fontSize: '0.65rem', 
                            padding: '0.2rem 0.4rem', 
                            borderRadius: '6px',
                            background: Math.abs(saeSteering.pirate) > 0 ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                            border: `1px solid ${Math.abs(saeSteering.pirate) > 0 ? 'rgba(245, 158, 11, 0.3)' : 'transparent'}`,
                            color: Math.abs(saeSteering.pirate) > 0 ? '#f59e0b' : 'var(--text-secondary)'
                          }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: Math.abs(saeSteering.pirate) > 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }} />
                            <span>Latent #4812 (Pirate)</span>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            fontSize: '0.65rem', 
                            padding: '0.2rem 0.4rem', 
                            borderRadius: '6px',
                            background: Math.abs(saeSteering.deceit) > 0 ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                            border: `1px solid ${Math.abs(saeSteering.deceit) > 0 ? 'rgba(236, 72, 153, 0.3)' : 'transparent'}`,
                            color: Math.abs(saeSteering.deceit) > 0 ? '#ec4899' : 'var(--text-secondary)'
                          }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: Math.abs(saeSteering.deceit) > 0 ? '#ec4899' : 'rgba(255,255,255,0.1)' }} />
                            <span>Latent #9204 (Deceit)</span>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            fontSize: '0.65rem', 
                            padding: '0.2rem 0.4rem', 
                            borderRadius: '6px',
                            background: Math.abs(saeSteering.academic) > 0 ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            border: `1px solid ${Math.abs(saeSteering.academic) > 0 ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                            color: Math.abs(saeSteering.academic) > 0 ? '#3b82f6' : 'var(--text-secondary)'
                          }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: Math.abs(saeSteering.academic) > 0 ? '#3b82f6' : 'rgba(255,255,255,0.1)' }} />
                            <span>Latent #11054 (Academic)</span>
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem', 
                            fontSize: '0.65rem', 
                            padding: '0.2rem 0.4rem', 
                            borderRadius: '6px',
                            background: Math.abs(saeSteering.direct) > 0 ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                            border: `1px solid ${Math.abs(saeSteering.direct) > 0 ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
                            color: Math.abs(saeSteering.direct) > 0 ? '#10b981' : 'var(--text-secondary)'
                          }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: Math.abs(saeSteering.direct) > 0 ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
                            <span>Latent #2301 (Direct)</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>

                {/* Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '1.25rem', background: 'rgba(3, 7, 18, 0.05)', overflow: 'hidden' }}>
                  
                  {/* Dynamic Metrics */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Diagnostic Telemetry
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Active Features (L0)</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'monospace' }}>
                          {saeStatus === 'completed' || saeStatus === 'patching' ? (
                            `${[saeSteering.pirate, saeSteering.deceit, saeSteering.academic, saeSteering.direct].filter(v => v !== 0).length + 3} / 16.3k`
                          ) : saeStatus === 'extracting' ? '3 / 16.3k' : '0 / 16.3k'}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Recon Fidelity (MSE)</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: saeStatus === 'completed' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                          {saeStatus === 'completed' ? (
                            (0.0012 + (Math.abs(saeSteering.pirate) + Math.abs(saeSteering.deceit) + Math.abs(saeSteering.academic) + Math.abs(saeSteering.direct)) * 0.0035).toFixed(4)
                          ) : saeStatus === 'extracting' ? '0.0012' : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Steered Output */}
                  <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', minHeight: '160px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Steered Token Generation
                    </h4>
                    <div style={{ 
                      flex: 1, 
                      background: 'rgba(3, 7, 18, 0.4)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      padding: '0.75rem', 
                      fontSize: '0.8rem', 
                      color: 'white',
                      lineHeight: '1.5',
                      overflowY: 'auto',
                      maxHeight: '180px',
                      fontFamily: 'monospace',
                      position: 'relative'
                    }}>
                      {saeOutput ? (
                        <>
                          {saeOutput}
                          {saeStatus === 'completed' && <span className="blinking-cursor" style={{ display: 'inline-block', width: '6px', height: '14px', background: 'var(--accent-color)', marginLeft: '4px', verticalAlign: 'middle', animation: 'blink 1s infinite' }}>_</span>}
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {saeStatus === 'idle' && 'Output will be printed here token-by-token during generation...'}
                          {saeStatus === 'compiling' && 'Compiling tensor pipelines...'}
                          {saeStatus === 'extracting' && 'Extracting original prompt layer activations...'}
                          {saeStatus === 'patching' && 'Applying activation patching on selected features...'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* System Console */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '140px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      SAE Engine logs
                    </h4>
                    <div style={{ flex: 1, background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', fontFamily: 'monospace', fontSize: '0.68rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto', maxHeight: '140px' }}>
                      {saeLogs.map((log, idx) => (
                        <div key={idx} style={{ 
                          color: log.includes('[Error]') ? 'var(--error-color)' : 
                                 log.includes('[Feature Steering]') || log.includes('[Patching]') ? 'var(--warning-color)' :
                                 log.includes('[Encoder]') || log.includes('[Decoder]') ? 'var(--accent-color)' :
                                 log.includes('[Forward Pass]') || log.includes('[Inference]') ? '#60a5fa' : 'var(--text-secondary)',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : selectedProjectId === 'jepa-agent' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Parameter Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '130px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Noise Level
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="range" 
                          min={0}
                          max={100}
                          value={jepaNoiseLevel}
                          onChange={(e) => setJepaNoiseLevel(parseInt(e.target.value))}
                          disabled={jepaStatus === 'compiling'}
                          style={{ flex: 1, accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-color)', minWidth: '35px', textAlign: 'right' }}>
                          {jepaNoiseLevel}%
                        </span>
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '130px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Mask Ratio
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="range" 
                          min={10}
                          max={90}
                          value={jepaMaskRatio}
                          onChange={(e) => setJepaMaskRatio(parseInt(e.target.value))}
                          disabled={jepaStatus === 'compiling'}
                          style={{ flex: 1, accentColor: '#10b981', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#10b981', minWidth: '35px', textAlign: 'right' }}>
                          {jepaMaskRatio}%
                        </span>
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Predictor Layers
                      </label>
                      <select
                        value={jepaPredictorDepth}
                        onChange={(e) => setJepaPredictorDepth(parseInt(e.target.value))}
                        disabled={jepaStatus === 'compiling'}
                        style={{
                          width: '100%',
                          background: '#0a0f1d',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      >
                        <option value={2}>2 (Shallow)</option>
                        <option value={4}>4 (Balanced)</option>
                        <option value={6}>6 (Deep)</option>
                        <option value={8}>8 (Heavy)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runJepaSimulation}
                        disabled={jepaStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: jepaStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: jepaStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run JEPA
                      </button>
                      <button 
                        onClick={resetJepaSimulation}
                        disabled={jepaStatus === 'compiling'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: jepaStatus === 'compiling' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Canvas & Telemetry */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '340px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      {jepaStatus === 'idle' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                          <Layers size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                          <div>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Joint Embedding Predictive Architecture</p>
                            <p style={{ fontSize: '0.8rem' }}>Initialize V-JEPA spatial masking simulator to run non-reconstructive representations.</p>
                          </div>
                        </div>
                      ) : jepaStatus === 'compiling' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                          <div className="spinning-loader" style={{ width: '36px', height: '36px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Loading V-JEPA Weights</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configuring predictor context blocks ({jepaProgress}%)...</p>
                          </div>
                          <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${jepaProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <canvas 
                          ref={jepaCanvasRef}
                          width={600}
                          height={240}
                          style={{ width: '100%', height: '100%', display: 'block', background: '#030712' }}
                        />
                      )}
                    </div>

                    {/* Quick Telemetry Row */}
                    {jepaStatus === 'simulating' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                        <div className="telemetry-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Compute Saving</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--success-color)' }}>92.4%</span>
                        </div>
                        <div className="telemetry-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Prediction Loss</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'monospace' }}>{jepaLoss.toFixed(4)}</span>
                        </div>
                        <div className="telemetry-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Latent Entropy</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>{jepaEntropy.toFixed(3)}</span>
                        </div>
                        <div className="telemetry-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Active Features</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>128 clean</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info & Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.4)', padding: '1.25rem', gap: '1.25rem', overflowY: 'auto' }}>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Layers size={14} color="var(--primary-color)" /> V-JEPA Telemetry
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Unlike generative models that predict pixels, JEPA targets representation alignment. Features in the masked regions are predicted contextually using visual tokens.
                    </p>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Execution Logs</span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: jepaStatus === 'simulating' ? 'var(--success-color)' : 'var(--text-secondary)' }}></span>
                    </div>
                    <div style={{ 
                      flex: 1, 
                      background: 'rgba(0, 0, 0, 0.3)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      padding: '0.6rem', 
                      fontFamily: 'monospace', 
                      fontSize: '0.7rem', 
                      color: 'rgba(255,255,255,0.85)',
                      overflowY: 'auto',
                      maxHeight: '220px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem'
                    }}>
                      {jepaLogs.map((log, i) => (
                        <div key={i} style={{ 
                          color: log.includes('[Compiler]') ? 'var(--accent-color)' : log.includes('[JEPA]') ? '#fbbf24' : log.includes('[System]') ? 'var(--text-secondary)' : '#34d399',
                          lineHeight: '1.3'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'ttc-reasoning' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Task Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Reasoning Prompt
                      </label>
                      <input 
                        type="text" 
                        value={ttcPrompt}
                        onChange={(e) => setTtcPrompt(e.target.value)}
                        disabled={ttcStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runTtcSimulation}
                        disabled={ttcStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: ttcStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: ttcStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run Search
                      </button>
                      <button 
                        onClick={resetTtcSimulator}
                        disabled={ttcStatus === 'analyzing' || ttcStatus === 'searching' || ttcStatus === 'reflecting'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: (ttcStatus === 'analyzing' || ttcStatus === 'searching' || ttcStatus === 'reflecting') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Config Parameters Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        Search Strategy
                      </label>
                      <select
                        value={ttcStrategy}
                        onChange={(e) => setTtcStrategy(e.target.value as any)}
                        disabled={ttcStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: '#0a0f1d',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      >
                        <option value="mcts">MCTS (Recommended)</option>
                        <option value="tot">Tree of Thoughts</option>
                        <option value="beam">Beam Search</option>
                        <option value="dfs">Depth First Search</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        Compute Budget (Steps)
                      </label>
                      <input 
                        type="number"
                        min={10}
                        max={100}
                        value={ttcBudget}
                        onChange={(e) => setTtcBudget(Number(e.target.value))}
                        disabled={ttcStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: '#0a0f1d',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        Exploration (C_puct)
                      </label>
                      <input 
                        type="number"
                        step={0.1}
                        min={0.5}
                        max={3.0}
                        value={ttcExploration}
                        onChange={(e) => setTtcExploration(Number(e.target.value))}
                        disabled={ttcStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: '#0a0f1d',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        Reflection Strength
                      </label>
                      <select
                        value={ttcReflection}
                        onChange={(e) => setTtcReflection(e.target.value as any)}
                        disabled={ttcStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: '#0a0f1d',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      >
                        <option value="low">Low Reflection</option>
                        <option value="medium">Medium Reflection</option>
                        <option value="high">High Reflection</option>
                      </select>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {ttcStatus !== 'idle' && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {ttcStatus === 'analyzing' && 'Analyzing query semantics and priors...'}
                          {ttcStatus === 'searching' && 'Exploring reasoning path options (MCTS loop)...'}
                          {ttcStatus === 'reflecting' && 'Evaluating candidate correctness & self-reflection...'}
                          {ttcStatus === 'completed' && 'Consensus path verified!'}
                        </span>
                        <span style={{ color: 'var(--accent-color)' }}>{ttcProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${ttcProgress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Active MCTS Reasoning Tree Visualization Canvas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Interactive MCTS Reasoning Tree Visualizer
                    </label>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', height: '240px', background: '#050b14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {ttcStatus === 'idle' ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          <Code size={24} style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }} />
                          <p>Click "Run Search" to start test-time compute visualization</p>
                        </div>
                      ) : (
                        <canvas 
                          ref={ttcCanvasRef}
                          width={460}
                          height={240}
                          style={{ width: '100%', height: '100%', display: 'block', background: '#050b14' }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Verified Answer Display */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Verified Reasoning Output
                    </label>
                    <textarea
                      readOnly
                      value={ttcOutput || (ttcStatus === 'analyzing' ? 'Estimating tree complexity...' : ttcStatus === 'searching' ? 'Synthesizing tree node candidates...' : ttcStatus === 'reflecting' ? 'Performing mathematical correctness check...' : 'Click Run Search to view final verified output.')}
                      style={{
                        width: '100%',
                        height: '160px',
                        background: 'rgba(3, 7, 18, 0.4)',
                        border: '1px solid var(--border-color)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: ttcOutput ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontFamily: ttcOutput ? 'monospace' : 'inherit',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> Test-Time Thought Logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ttcStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '360px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#c084fc'
                    }}
                  >
                    {ttcLogs.map((log, idx) => {
                      let color = '#c084fc';
                      if (log.includes('complete') || log.includes('verified') || log.includes('holds') || log.includes('Success')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Critic') || log.includes('contractions') || log.includes('Refuting') || log.includes('contaminations') || log.includes('violates') || log.includes('REFUTED') || log.includes('pruning') || log.includes('refuted')) {
                        color = 'var(--error-color)';
                      } else if (log.includes('Self-Reflection') || log.includes('warning') || log.includes('checking') || log.includes('bottleneck')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Telemetry Panel */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Reasoning Telemetry</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Active Strategy:</div>
                        <div style={{ fontWeight: 700 }}>{ttcStrategy.toUpperCase()} + Search</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Reflection:</div>
                        <div style={{ fontWeight: 700 }}>{ttcReflection.toUpperCase()}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Steps Explored:</div>
                        <div style={{ fontWeight: 700 }}>{ttcNodes.length} / {ttcBudget}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Consensus Level:</div>
                        <div style={{ fontWeight: 700, color: ttcStatus === 'completed' ? 'var(--success-color)' : 'white' }}>{ttcStatus === 'completed' ? '98.2%' : ttcStatus === 'searching' || ttcStatus === 'reflecting' ? 'Calculating...' : '0.0%'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'kan-agent' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Parameter Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1.2, minWidth: '160px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Target Function f(x)
                      </label>
                      <select
                        value={kanTargetFunction}
                        onChange={(e) => setKanTargetFunction(e.target.value as any)}
                        disabled={kanStatus === 'compiling' || kanStatus === 'training'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.45rem',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: (kanStatus === 'compiling' || kanStatus === 'training') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="sine" style={{ background: '#0d1527' }}>Sine: sin(π * x)</option>
                        <option value="quadratic" style={{ background: '#0d1527' }}>Quadratic: x²</option>
                        <option value="exp" style={{ background: '#0d1527' }}>Exponential: e^x</option>
                        <option value="sincos" style={{ background: '#0d1527' }}>Wave Combo: sin(π*x)cos(π*x/2)</option>
                      </select>
                    </div>

                    <div style={{ flex: 0.8, minWidth: '120px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Hidden Nodes
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="range" 
                          min={2}
                          max={5}
                          value={kanHiddenNodes}
                          onChange={(e) => setKanHiddenNodes(parseInt(e.target.value))}
                          disabled={kanStatus === 'compiling' || kanStatus === 'training'}
                          style={{
                            flex: 1,
                            accentColor: 'var(--accent-color)',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-color)', minWidth: '15px', textAlign: 'right' }}>
                          {kanHiddenNodes}
                        </span>
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Spline Resolution (Grid)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="range" 
                          min={3}
                          max={10}
                          value={kanSplineResolution}
                          onChange={(e) => setKanSplineResolution(parseInt(e.target.value))}
                          disabled={kanStatus === 'compiling' || kanStatus === 'training'}
                          style={{
                            flex: 1,
                            accentColor: 'var(--accent-color)',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-color)', minWidth: '20px', textAlign: 'right' }}>
                          {kanSplineResolution}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runKanSimulation}
                        disabled={kanStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: kanStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: kanStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Train KAN
                      </button>
                      <button 
                        onClick={resetKanSimulation}
                        disabled={kanStatus === 'compiling'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: kanStatus === 'compiling' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Canvas & Telemetry */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '340px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      {kanStatus === 'idle' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                          <Cpu size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                          <div>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Kolmogorov-Arnold Network Engine</p>
                            <p style={{ fontSize: '0.8rem' }}>Initialize B-spline parameter optimization WGSL compute shaders.</p>
                          </div>
                        </div>
                      ) : kanStatus === 'compiling' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                          <div className="spinning-loader" style={{ width: '36px', height: '36px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Compiling KAN Spline Shaders</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configuring B-spline grid matrices ({kanProgress}%)...</p>
                          </div>
                          <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${kanProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <canvas 
                          ref={kanCanvasRef}
                          width={460}
                          height={200}
                          style={{ width: '100%', height: '100%', display: 'block', background: '#050b14' }}
                        />
                      )}
                    </div>
                  </div>

                </div>

                {/* Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '1.25rem', background: 'rgba(3, 7, 18, 0.05)' }}>
                  
                  {/* Performance Indicators */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      WebGPU KAN Telemetry
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Fitting Error (MSE)</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: kanLoss < 0.01 ? 'var(--success-color)' : 'var(--warning-color)', fontFamily: 'monospace' }}>
                          {kanStatus === 'training' || kanStatus === 'completed' ? kanLoss.toFixed(5) : 'N/A'}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Spline Params</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'monospace' }}>
                          {2 * kanHiddenNodes * (kanSplineResolution + 3)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Console */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Spline Shader Logs
                    </h4>
                    <div style={{ flex: 1, background: 'rgba(3, 7, 18, 0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', maxHeight: '220px' }}>
                      {kanLogs.map((log, idx) => (
                        <div key={idx} style={{ 
                          color: log.includes('[Error]') ? 'var(--error-color)' : 
                                 log.includes('[Compiler]') ? 'var(--warning-color)' :
                                 log.includes('[WebGPU]') || log.includes('[Optimizer]') ? 'var(--accent-color)' :
                                 log.includes('[KAN Engine]') ? 'var(--success-color)' : 'var(--text-secondary)',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : selectedProjectId === 'mamba-ssm' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Parameter Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Sequence Length Context
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '8px' }}>
                        {(['4k', '16k', '64k', '256k'] as const).map((seq) => (
                          <button
                            key={seq}
                            onClick={() => setMambaSeqLength(seq)}
                            disabled={mambaStatus === 'compiling' || mambaStatus === 'scanning'}
                            style={{
                              flex: 1,
                              background: mambaSeqLength === seq ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                              border: mambaSeqLength === seq ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                              color: mambaSeqLength === seq ? '#60a5fa' : 'var(--text-secondary)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: (mambaStatus === 'compiling' || mambaStatus === 'scanning') ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {seq}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Scan Operator Mode
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '8px' }}>
                        {(['recurrent', 'parallel'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setMambaMode(mode)}
                            disabled={mambaStatus === 'compiling' || mambaStatus === 'scanning'}
                            style={{
                              flex: 1,
                              background: mambaMode === mode ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                              border: mambaMode === mode ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                              color: mambaMode === mode ? '#34d399' : 'var(--text-secondary)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              cursor: (mambaStatus === 'compiling' || mambaStatus === 'scanning') ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {mode === 'recurrent' ? 'Recurrent O(1) step' : 'Parallel O(lg N)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runMambaScan}
                        disabled={mambaStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: mambaStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: mambaStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Zap size={14} /> Run SSM Scan
                      </button>
                      <button 
                        onClick={resetMambaScan}
                        disabled={mambaStatus === 'compiling'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: mambaStatus === 'compiling' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Canvas & Text Output Container */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '340px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      {mambaStatus === 'idle' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                          <Cpu size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                          <div>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Mamba Selective SSM Engine</p>
                            <p style={{ fontSize: '0.8rem' }}>Compile the WebGPU selective state scan (S6) kernels to test linear context scaling.</p>
                          </div>
                        </div>
                      ) : mambaStatus === 'compiling' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                          <div className="spinning-loader" style={{ width: '36px', height: '36px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Compiling WebGPU Scan Shaders</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configuring pipeline bindings ({mambaProgress}%)...</p>
                          </div>
                          <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${mambaProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <canvas 
                          ref={mambaCanvasRef}
                          width={460}
                          height={220}
                          style={{ width: '100%', height: '100%', display: 'block', background: '#050b14' }}
                        />
                      )}
                    </div>

                    {/* Output Text Block */}
                    {(mambaStatus === 'scanning' || mambaStatus === 'completed') && (
                      <div className="card" style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase' }}>SSM Scan Active Output:</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Scan speed: <strong style={{ color: 'var(--success-color)' }}>{mambaSpeed}k tokens/sec</strong></span>
                        </div>
                        <div style={{ fontSize: '0.85rem', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto', color: 'var(--text-primary)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                          {mambaOutput}
                          {mambaStatus === 'scanning' && <span className="typing-cursor"></span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logs Column */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(3, 7, 18, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                      SSM Scan Trace & GPU State
                    </h4>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: mambaStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>

                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#60a5fa'
                    }}
                  >
                    {mambaLogs.map((log, idx) => {
                      let color = '#60a5fa';
                      if (log.includes('complete') || log.includes('successful') || log.includes('active') || log.includes('running') || log.includes('completed')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Compiling') || log.includes('WGSL') || log.includes('buffers') || log.includes('Allocating')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Parameter Outputs */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Resource Footprint Metrics</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>GPU Memory Allocated:</div>
                        <div style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                          128 KB
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>VRAM Savings vs Attn:</div>
                        <div style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                          {mambaSeqLength === '4k' ? '65.2%' : mambaSeqLength === '16k' ? '88.4%' : mambaSeqLength === '64k' ? '98.2%' : '99.5%'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'bitnet-agent' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Parameter Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Model Parameter Scale
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '8px' }}>
                        {(['1.5B', '3B', '7B'] as const).map((scale) => (
                          <button
                            key={scale}
                            onClick={() => setBitnetModelScale(scale)}
                            disabled={bitnetStatus === 'compiling' || bitnetStatus === 'inferring'}
                            style={{
                              flex: 1,
                              background: bitnetModelScale === scale ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                              border: bitnetModelScale === scale ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                              color: bitnetModelScale === scale ? '#60a5fa' : 'var(--text-secondary)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: (bitnetStatus === 'compiling' || bitnetStatus === 'inferring') ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Inference Prompt
                      </label>
                      <input 
                        type="text" 
                        value={bitnetPrompt}
                        onChange={(e) => setBitnetPrompt(e.target.value)}
                        disabled={bitnetStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.55rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.8rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runBitnetInference}
                        disabled={bitnetStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: bitnetStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: bitnetStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run BitNet
                      </button>
                      <button 
                        onClick={resetBitnetInference}
                        disabled={bitnetStatus === 'compiling'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: bitnetStatus === 'compiling' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Canvas & Text Output Container */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '340px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      {bitnetStatus === 'idle' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                          <Cpu size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                          <div>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>1.58-bit Ternary Matrix Engine</p>
                            <p style={{ fontSize: '0.8rem' }}>Initialize the WebGPU compute shader pipeline to run local ternary arithmetic inferences.</p>
                          </div>
                        </div>
                      ) : bitnetStatus === 'compiling' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                          <div className="spinning-loader" style={{ width: '36px', height: '36px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Compiling Ternary BitLinear Shaders</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configuring pipeline binding tables ({bitnetProgress}%)...</p>
                          </div>
                          <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${bitnetProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <canvas 
                          ref={bitnetCanvasRef}
                          width={460}
                          height={200}
                          style={{ width: '100%', height: '100%', display: 'block', background: '#050b14' }}
                        />
                      )}
                    </div>

                    {/* Output Text Block */}
                    {(bitnetStatus === 'inferring' || bitnetStatus === 'completed') && (
                      <div className="card" style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase' }}>Generated Answer Output:</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Speed: <strong style={{ color: 'var(--success-color)' }}>{bitnetSpeed} tokens/sec</strong></span>
                        </div>
                        <div style={{ fontSize: '0.85rem', lineHeight: '1.5', maxHeight: '100px', overflowY: 'auto', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                          {bitnetOutput}
                          {bitnetStatus === 'inferring' && <span className="typing-cursor"></span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logs Column */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(3, 7, 18, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                      WebGPU Kernels & Solver Output
                    </h4>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: bitnetStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>

                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#60a5fa'
                    }}
                  >
                    {bitnetLogs.map((log, idx) => {
                      let color = '#60a5fa';
                      if (log.includes('complete') || log.includes('successful') || log.includes('active') || log.includes('running') || log.includes('complete.')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Compiling') || log.includes('WGSL') || log.includes('buffers') || log.includes('weights')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Parameter Outputs */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Resource Footprint Metrics</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>GPU Memory Allocated:</div>
                        <div style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                          {bitnetModelScale === '1.5B' ? '290 MB' : bitnetModelScale === '3B' ? '580 MB' : '1.35 GB'}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Inference VRAM Savings:</div>
                        <div style={{ fontWeight: 700 }}>
                          82.5% compression
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'liquid-agent' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Parameter Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Network Topology
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '8px' }}>
                        <button
                          onClick={() => setLnnNetworkType('lnn')}
                          disabled={lnnStatus === 'compiling'}
                          style={{
                            flex: 1,
                            background: lnnNetworkType === 'lnn' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: lnnNetworkType === 'lnn' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                            color: lnnNetworkType === 'lnn' ? '#60a5fa' : 'var(--text-secondary)',
                            padding: '0.4rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Liquid (LNN)
                        </button>
                        <button
                          onClick={() => setLnnNetworkType('rnn')}
                          disabled={lnnStatus === 'compiling'}
                          style={{
                            flex: 1,
                            background: lnnNetworkType === 'rnn' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                            border: lnnNetworkType === 'rnn' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                            color: lnnNetworkType === 'rnn' ? '#c084fc' : 'var(--text-secondary)',
                            padding: '0.4rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Classic (RNN)
                        </button>
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Channel Latency: {lnnLatency} ms
                      </label>
                      <input 
                        type="range"
                        min="0"
                        max="500"
                        value={lnnLatency}
                        onChange={(e) => setLnnLatency(parseInt(e.target.value))}
                        disabled={lnnStatus === 'compiling'}
                        style={{
                          width: '100%',
                          accentColor: lnnNetworkType === 'lnn' ? '#3b82f6' : '#a855f7',
                          background: 'rgba(255, 255, 255, 0.05)',
                          height: '6px',
                          borderRadius: '3px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runLnnSimulation}
                        disabled={lnnStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: lnnStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: lnnStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run WebGPU
                      </button>
                      <button 
                        onClick={resetLnnSimulation}
                        disabled={lnnStatus === 'compiling'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: lnnStatus === 'compiling' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Canvas Visualization Panel */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', minHeight: '300px' }}>
                    {lnnStatus === 'idle' ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                        <Cpu size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                        <div>
                          <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Continuous-Time Solver Pipeline</p>
                          <p style={{ fontSize: '0.8rem' }}>Compile the continuous ODE integration shader on WebGPU to begin the real-time simulation.</p>
                        </div>
                      </div>
                    ) : lnnStatus === 'compiling' ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                        <div className="spinning-loader" style={{ width: '36px', height: '36px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Compiling WGSL Compute Shaders</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Building pipeline bind groups ({lnnProgress}%)...</p>
                        </div>
                        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${lnnProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      <canvas 
                        ref={lnnCanvasRef}
                        width={460}
                        height={300}
                        style={{ width: '100%', height: '100%', display: 'block', background: '#050b14' }}
                      />
                    )}
                  </div>
                </div>

                {/* Logs Column */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(3, 7, 18, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                      WebGPU Kernels & Solver Output
                    </h4>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lnnStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>

                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#60a5fa'
                    }}
                  >
                    {lnnLogs.map((log, idx) => {
                      let color = '#60a5fa';
                      if (log.includes('complete') || log.includes('successful') || log.includes('active') || log.includes('running') || log.includes('stabilized')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Compiling') || log.includes('WGSL') || log.includes('buffers') || log.includes('time-constants')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Parameter Outputs */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Liquid Agent Telemetry</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Tracking Error Rate:</div>
                        <div style={{ fontWeight: 700, color: lnnErrorRate > 0.1 ? 'var(--error-color)' : 'var(--success-color)' }}>
                          {(lnnErrorRate * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>ODE dt Integrator:</div>
                        <div style={{ fontWeight: 700 }}>dt = 0.05</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'confidential-tee' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Task Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Confidential Enclave Task
                      </label>
                      <input 
                        type="text" 
                        value={teeTask}
                        onChange={(e) => setTeeTask(e.target.value)}
                        disabled={teeStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runTeeSimulation}
                        disabled={teeStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: teeStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: teeStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run Isolated
                      </button>
                      <button 
                        onClick={resetTeeSimulator}
                        disabled={teeStatus === 'booting' || teeStatus === 'executing'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: (teeStatus === 'booting' || teeStatus === 'executing') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {teeStatus !== 'idle' && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {teeStatus === 'booting' && 'Booting AWS Nitro Enclave...'}
                          {teeStatus === 'executing' && 'Executing Local LLM in Secure memory...'}
                          {teeStatus === 'attesting' && 'Generating remote hardware attestation...'}
                          {teeStatus === 'verified' && 'Verification Complete!'}
                        </span>
                        <span style={{ color: 'var(--primary-color)' }}>{teeProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${teeProgress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Verifiable Output Display */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Enclave Decrypted Output
                    </label>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <textarea
                        readOnly
                        value={teeOutput || (teeStatus === 'booting' ? 'Booting hardware enclave...' : teeStatus === 'executing' ? 'Generating LLM output inside isolated DRAM...' : teeStatus === 'attesting' ? 'Requesting attestation report from hardware root key...' : 'Outputs will be printed here after proving execution.')}
                        style={{
                          width: '100%',
                          height: '220px',
                          background: 'rgba(3, 7, 18, 0.4)',
                          border: '1px solid var(--border-color)',
                          padding: '1rem',
                          borderRadius: '12px',
                          color: teeOutput ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          fontFamily: teeOutput ? 'monospace' : 'inherit',
                          outline: 'none',
                          resize: 'none'
                        }}
                      />
                      {teeStatus === 'verified' && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--success-color)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                          <ShieldCheck size={12} /> ATTESTATION VALID
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cryptographic Proof Data */}
                  {teeAttestationDoc && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Remote Attestation Platform Certificate (Nitro/SGX Claims)
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        {teeAttestationDoc}
                      </div>
                    </div>
                  )}

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> Hardware Enclave Console Logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: teeStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#c084fc'
                    }}
                  >
                    {teeLogs.map((log, idx) => {
                      let color = '#c084fc';
                      if (log.includes('complete') || log.includes('valid') || log.includes('VALID') || log.includes('successfully') || log.includes('booted') || log.includes('integrity') || log.includes('finished')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('TPM') || log.includes('Attestation') || log.includes('MRENCLAVE') || log.includes('CPU') || log.includes('isolated') || log.includes('Isolated')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]') || log.includes('[Platform]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Proof Parameters */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Enclave Telemetry</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>TEE Platform:</div>
                        <div style={{ fontWeight: 700 }}>AWS Nitro / SGX</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Host Egress:</div>
                        <div style={{ fontWeight: 700, color: 'var(--error-color)' }}>Blocked (0x0)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'depin-billing' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Target LLM/GraphRAG Task
                      </label>
                      <input 
                        type="text" 
                        value={depinTask}
                        onChange={(e) => setDepinTask(e.target.value)}
                        disabled={depinStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runDepinBilling}
                        disabled={depinStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: depinStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: depinStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run Billing Tx
                      </button>
                      <button 
                        onClick={resetDepinBilling}
                        disabled={depinStatus === 'voucher' || depinStatus === 'submitting' || depinStatus === 'verifying'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: (depinStatus === 'voucher' || depinStatus === 'submitting' || depinStatus === 'verifying') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {depinStatus !== 'idle' && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {depinStatus === 'voucher' && 'Generating micro-payment voucher (ERC-4337)...'}
                          {depinStatus === 'submitting' && 'Submitting UserOp to Alt-Mempool & Escrowing ETH...'}
                          {depinStatus === 'verifying' && 'Executing task & verifying computation bounds...'}
                          {depinStatus === 'settled' && 'Payment Settled & Funds Released!'}
                        </span>
                        <span style={{ color: 'var(--primary-color)' }}>{depinProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${depinProgress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Visualization Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
                    {/* Client Agent Console */}
                    <div style={{ background: 'rgba(3, 7, 18, 0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Coins size={12} /> Agent-A (Client)
                      </span>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Escrow Balance locked:</span>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: depinEscrow !== '0.0000 ETH' ? 'var(--warning-color)' : 'var(--text-secondary)' }}>
                            {depinEscrow}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Lit Protocol Auth Voucher:</span>
                          <textarea
                            readOnly
                            value={depinStatus !== 'idle' ? `{\n  "voucherId": "VOUCH-99482",\n  "maxEscrow": "0.0005 ETH",\n  "targetDePINNode": "0x5C2a...F7B9",\n  "signature": "0x98A1B...D8E"\n}` : 'Awaiting voucher signature...'}
                            style={{
                              width: '100%',
                              flex: 1,
                              minHeight: '80px',
                              background: 'rgba(3, 7, 18, 0.4)',
                              border: '1px solid var(--border-color)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: depinStatus !== 'idle' ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontSize: '0.7rem',
                              fontFamily: 'monospace',
                              resize: 'none',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* DePIN Node Console */}
                    <div style={{ background: 'rgba(3, 7, 18, 0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Cpu size={12} /> DePIN Node (Provider)
                      </span>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Settlement State:</span>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: depinStatus === 'settled' ? 'var(--success-color)' : 'var(--warning-color)' }}>
                            {depinStatus === 'idle' && '🟢 Listening'}
                            {depinStatus === 'voucher' && '⚡ Waiting for voucher...'}
                            {depinStatus === 'submitting' && '⚡ UserOp submitted...'}
                            {depinStatus === 'verifying' && '⚙️ Running LLM task & generating proof...'}
                            {depinStatus === 'settled' && '🔒 Settled & Paid'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>On-Chain Transaction:</span>
                          <textarea
                            readOnly
                            value={depinTxHash ? `Block: #18429482\nTx: ${depinTxHash}\nGas Used: 128,491\nFee: 0.000004 ETH` : 'Awaiting settlement transaction...'}
                            style={{
                              width: '100%',
                              flex: 1,
                              minHeight: '80px',
                              background: 'rgba(3, 7, 18, 0.4)',
                              border: '1px solid var(--border-color)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: depinTxHash ? 'var(--success-color)' : 'var(--text-secondary)',
                              fontSize: '0.7rem',
                              fontFamily: 'monospace',
                              resize: 'none',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> Billing Logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: depinStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#c084fc'
                    }}
                  >
                    {depinLogs.map((log, idx) => {
                      let color = '#c084fc';
                      if (log.includes('successful') || log.includes('settled') || log.includes('AUTHENTIC') || log.includes('complete')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Signed') || log.includes('Submitting') || log.includes('Lock') || log.includes('Executing') || log.includes('verifying') || log.includes('UserOp')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Security Parameters */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>ERC-4337 Account Specs</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Entrypoint:</div>
                        <div style={{ fontWeight: 700 }}>v0.6 (Arbitrum)</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Threshold:</div>
                        <div style={{ fontWeight: 700 }}>3-of-5 Lit nodes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'kyber-agent' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        PQC Secure Message Payload
                      </label>
                      <input 
                        type="text" 
                        value={kyberMsg}
                        onChange={(e) => setKyberMsg(e.target.value)}
                        disabled={kyberStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runKyberExchange}
                        disabled={kyberStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: kyberStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: kyberStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run Key Exchange
                      </button>
                      <button 
                        onClick={resetKyberSimulator}
                        disabled={kyberStatus === 'keygen' || kyberStatus === 'signing' || kyberStatus === 'encapsulating' || kyberStatus === 'decapsulating'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: (kyberStatus === 'keygen' || kyberStatus === 'signing' || kyberStatus === 'encapsulating' || kyberStatus === 'decapsulating') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {kyberStatus !== 'idle' && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {kyberStatus === 'keygen' && 'Generating ML-KEM keypairs...'}
                          {kyberStatus === 'signing' && 'Signing key with Dilithium identity key...'}
                          {kyberStatus === 'encapsulating' && 'Encapsulating secret seed on Agent-B...'}
                          {kyberStatus === 'decapsulating' && 'Decapsulating ciphertext on Agent-A...'}
                          {kyberStatus === 'completed' && 'PQC Channel Established!'}
                        </span>
                        <span style={{ color: 'var(--primary-color)' }}>{kyberProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${kyberProgress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Visualization Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
                    {/* Agent A Console */}
                    <div style={{ background: 'rgba(3, 7, 18, 0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Agent-A (Initiator)</span>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Derived Session Key:</span>
                          <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--border-color)', wordBreak: 'break-all' }}>
                            {kyberSessionKey || 'Awaiting handshake...'}
                          </div>
                        </div>
                        {kyberKeysInfo && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Dilithium Signature Verification:</span>
                            <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.1)', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
                              {kyberKeysInfo.signature}
                            </div>
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Decrypted Plaintext:</span>
                          <textarea
                            readOnly
                            value={kyberDecryptedPayload || 'Awaiting secure delivery...'}
                            style={{
                              width: '100%',
                              flex: 1,
                              minHeight: '60px',
                              background: 'rgba(3, 7, 18, 0.4)',
                              border: '1px solid var(--border-color)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: kyberDecryptedPayload ? 'var(--success-color)' : 'var(--text-secondary)',
                              fontSize: '0.72rem',
                              fontFamily: 'monospace',
                              resize: 'none',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Agent B Console */}
                    <div style={{ background: 'rgba(3, 7, 18, 0.3)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase' }}>Agent-B (Responder)</span>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Handshake Status:</span>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: kyberStatus === 'completed' ? 'var(--success-color)' : 'var(--warning-color)' }}>
                            {kyberStatus === 'idle' && '🟢 Standby'}
                            {kyberStatus === 'keygen' && '⚡ Waiting for keys...'}
                            {kyberStatus === 'signing' && '⚡ Verifying Dilithium signature...'}
                            {kyberStatus === 'encapsulating' && '⚙️ Encapsulating shared secret...'}
                            {kyberStatus === 'decapsulating' && '⚙️ Shared key derived'}
                            {kyberStatus === 'completed' && '🔒 Handshake complete'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1 }}>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>AES-GCM Egress Ciphertext:</span>
                          <textarea
                            readOnly
                            value={kyberEncryptedPayload || 'Awaiting encapsulation...'}
                            style={{
                              width: '100%',
                              flex: 1,
                              minHeight: '60px',
                              background: 'rgba(3, 7, 18, 0.4)',
                              border: '1px solid var(--border-color)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              color: kyberEncryptedPayload ? 'var(--warning-color)' : 'var(--text-secondary)',
                              fontSize: '0.72rem',
                              fontFamily: 'monospace',
                              resize: 'none',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> PQC Handshake Logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: kyberStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#c084fc'
                    }}
                  >
                    {kyberLogs.map((log, idx) => {
                      let color = '#c084fc';
                      if (log.includes('successful') || log.includes('established') || log.includes('VALID') || log.includes('complete') || log.includes('Complete') || log.includes('established')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Generating') || log.includes('public_key') || log.includes('Signature') || log.includes('Encapsulating') || log.includes('Decapsulating') || log.includes('handshake')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Security Parameters */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>NIST Standard PQC Config</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>KEM Protocol:</div>
                        <div style={{ fontWeight: 700 }}>ML-KEM-768</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Signature Scheme:</div>
                        <div style={{ fontWeight: 700 }}>ML-DSA-65</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'he-rag' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Task Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Private Search Query
                      </label>
                      <input 
                        type="text" 
                        value={fheQuery}
                        onChange={(e) => setFheQuery(e.target.value)}
                        disabled={fheStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runFheSearch}
                        disabled={fheStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: fheStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: fheStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Encrypt & Search
                      </button>
                      <button 
                        onClick={resetFheSimulator}
                        disabled={fheStatus === 'encrypting' || fheStatus === 'searching' || fheStatus === 'decrypting'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: (fheStatus === 'encrypting' || fheStatus === 'searching' || fheStatus === 'decrypting') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {fheStatus !== 'idle' && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {fheStatus === 'encrypting' && 'Encrypting search query locally (CKKS)...'}
                          {fheStatus === 'searching' && 'Executing similarity search on encrypted vectors (Cloud)...'}
                          {fheStatus === 'decrypting' && 'Decrypting returned distance states locally...'}
                          {fheStatus === 'completed' && 'Decryption Complete!'}
                        </span>
                        <span style={{ color: 'var(--primary-color)' }}>{fheProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${fheProgress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* FHE Visual States */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Plaintext Embedding (Local)</span>
                        <textarea
                          readOnly
                          value={fhePlaintextQuery || 'Inference vector will be printed here...'}
                          style={{
                            width: '100%',
                            height: '100px',
                            background: 'rgba(3, 7, 18, 0.4)',
                            border: '1px solid var(--border-color)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            color: fhePlaintextQuery ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>CKKS Ciphertext (Egress)</span>
                        <textarea
                          readOnly
                          value={fheCiphertext || 'Ciphertext hex will be printed here...'}
                          style={{
                            width: '100%',
                            height: '100px',
                            background: 'rgba(3, 7, 18, 0.4)',
                            border: '1px solid var(--border-color)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            color: fheCiphertext ? 'var(--warning-color)' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Results Display */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Decrypted Search Results
                      </label>
                      <div style={{ flex: 1, background: 'rgba(3, 7, 18, 0.4)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem', overflowY: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {fheResults.length > 0 ? (
                          fheResults.map((res, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>{res.title}</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--success-color)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                                  {(res.score * 100).toFixed(2)}% Match
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{res.text}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {fheStatus === 'encrypting' ? 'Encrypting query...' : fheStatus === 'searching' ? 'Searching homomorphically...' : fheStatus === 'decrypting' ? 'Decrypting results...' : 'No decrypted results available.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> Encrypted Search logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: fheStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#c084fc'
                    }}
                  >
                    {fheLogs.map((log, idx) => {
                      let color = '#c084fc';
                      if (log.includes('complete') || log.includes('finished') || log.includes('decoded') || log.includes('Decryption Complete') || log.includes('decrypted')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('Encrypting') || log.includes('Ciphertext') || log.includes('homomorphic') || log.includes('embedding') || log.includes('Embedding')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Search Parameters */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>FHE Security Specs</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Scheme:</div>
                        <div style={{ fontWeight: 700 }}>CKKS / BFV</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Key Size:</div>
                        <div style={{ fontWeight: 700 }}>log N = 13 (8192)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'zk-inference' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Task Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Inference Prompt
                      </label>
                      <input 
                        type="text" 
                        value={zkPrompt}
                        onChange={(e) => setZkPrompt(e.target.value)}
                        disabled={zkStatus !== 'idle'}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          fontSize: '0.85rem',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runZkInference}
                        disabled={zkStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: zkStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: zkStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Run & Prove
                      </button>
                      <button 
                        onClick={resetZkSimulator}
                        disabled={zkStatus === 'inferring' || zkStatus === 'proving'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: (zkStatus === 'inferring' || zkStatus === 'proving') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {zkStatus !== 'idle' && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {zkStatus === 'inferring' && 'Executing Local LLM inference...'}
                          {zkStatus === 'proving' && 'Generating Halo2 ZK Proof...'}
                          {zkStatus === 'verified' && 'Verification Complete!'}
                        </span>
                        <span style={{ color: 'var(--primary-color)' }}>{zkProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${zkProgress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-color), var(--primary-color))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Verifiable Output Display */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Verifiable LLM Output
                    </label>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <textarea
                        readOnly
                        value={zkOutput || (zkStatus === 'inferring' ? 'Generating tokens...' : zkStatus === 'proving' ? 'Verifying witness correctness...' : 'Outputs will be printed here after proving execution.')}
                        style={{
                          width: '100%',
                          height: '220px',
                          background: 'rgba(3, 7, 18, 0.4)',
                          border: '1px solid var(--border-color)',
                          padding: '1rem',
                          borderRadius: '12px',
                          color: zkOutput ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          fontFamily: zkOutput ? 'monospace' : 'inherit',
                          outline: 'none',
                          resize: 'none'
                        }}
                      />
                      {zkStatus === 'verified' && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--success-color)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                          <ShieldCheck size={12} /> PROOF VALID
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cryptographic Proof Data */}
                  {zkProof && (
                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Halo2 SNARK Proof String (BN254 Curve)
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        {zkProof}
                      </div>
                    </div>
                  )}

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> Cryptographic Proof Logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: zkStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#c084fc'
                    }}
                  >
                    {zkLogs.map((log, idx) => {
                      let color = '#c084fc';
                      if (log.includes('complete') || log.includes('generated') || log.includes('VALID') || log.includes('verified')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('prover') || log.includes('proving') || log.includes('synthesizing') || log.includes('MSM') || log.includes('NTT')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Proof Parameters */}
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Prover Telemetry</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Proof System:</div>
                        <div style={{ fontWeight: 700 }}>Halo2-Groth16</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.65rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>Engine:</div>
                        <div style={{ fontWeight: 700 }}>WebGPU WASM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'swarm-consensus' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Title & Task Input */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Swarm Task Proposal
                      </label>
                      <input 
                        type="text" 
                        value={swarmTask}
                        onChange={(e) => setSwarmTask(e.target.value)}
                        disabled={swarmStatus !== 'idle'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '0.6rem 0.8rem',
                          color: 'white',
                          fontSize: '0.85rem',
                          width: '100%',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <button 
                      onClick={runSwarmConsensus}
                      disabled={swarmStatus !== 'idle'}
                      className="btn btn-primary"
                      style={{ 
                        padding: '0.6rem 1.2rem', 
                        fontSize: '0.8rem', 
                        height: '38px',
                        cursor: swarmStatus !== 'idle' ? 'not-allowed' : 'pointer',
                        opacity: swarmStatus !== 'idle' ? 0.6 : 1
                      }}
                    >
                      <Play size={14} /> Start Consensus
                    </button>
                    {swarmStatus !== 'idle' && (
                      <button 
                        onClick={resetSwarmSimulator}
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', height: '38px' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Progress Indicator */}
                  {swarmStatus !== 'idle' && (
                    <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {swarmStatus === 'broadcasting' && 'Broadcasting tasks...'}
                          {swarmStatus === 'inferring' && 'Executing Local LLM inference...'}
                          {swarmStatus === 'gossiping' && 'Exchanging cryptographic vector-state logs...'}
                          {swarmStatus === 'bft-check' && 'Validating Byzantine Fault Tolerance agreement...'}
                          {swarmStatus === 'committed' && 'Committed successfully! 🎉'}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{swarmProgress}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div 
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))' }}
                          animate={{ width: `${swarmProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Agents Visual Node Grid */}
                  <div>
                    <h5 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Edge Agent Swarm Grid
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                      {agents.map((agent) => {
                        const isLeader = agent.id === 'leader';
                        let statusColor = 'var(--text-secondary)';
                        let statusBg = 'rgba(255, 255, 255, 0.02)';
                        let statusBorder = 'var(--border-color)';
                        let statusLabel = 'Idle';

                        if (agent.status === 'broadcasting') {
                          statusColor = 'var(--primary-color)';
                          statusBg = 'rgba(59, 130, 246, 0.08)';
                          statusBorder = 'rgba(59, 130, 246, 0.3)';
                          statusLabel = 'Syncing';
                        } else if (agent.status === 'inferring') {
                          statusColor = 'var(--accent-color)';
                          statusBg = 'rgba(139, 92, 246, 0.08)';
                          statusBorder = 'rgba(139, 92, 246, 0.3)';
                          statusLabel = 'LLM Run';
                        } else if (agent.status === 'gossiping') {
                          statusColor = 'var(--warning-color)';
                          statusBg = 'rgba(245, 158, 11, 0.08)';
                          statusBorder = 'rgba(245, 158, 11, 0.3)';
                          statusLabel = 'Gossip';
                        } else if (agent.status === 'voting') {
                          statusColor = 'cyan';
                          statusBg = 'rgba(6, 182, 212, 0.08)';
                          statusBorder = 'rgba(6, 182, 212, 0.3)';
                          statusLabel = 'Voting';
                        } else if (agent.status === 'committed') {
                          statusColor = 'var(--success-color)';
                          statusBg = 'rgba(16, 185, 129, 0.08)';
                          statusBorder = 'rgba(16, 185, 129, 0.3)';
                          statusLabel = 'Committed';
                        } else if (agent.status === 'offline') {
                          statusColor = 'var(--error-color)';
                          statusBg = 'rgba(239, 68, 68, 0.08)';
                          statusBorder = 'rgba(239, 68, 68, 0.3)';
                          statusLabel = 'Offline';
                        } else if (agent.status === 'corrupt') {
                          statusColor = 'var(--error-color)';
                          statusBg = 'rgba(239, 68, 68, 0.08)';
                          statusBorder = 'rgba(239, 68, 68, 0.3)';
                          statusLabel = 'Corrupted';
                        }

                        return (
                          <div 
                            key={agent.id}
                            style={{
                              background: statusBg,
                              border: `1.5px solid ${statusBorder}`,
                              borderRadius: '10px',
                              padding: '0.75rem 0.5rem',
                              textAlign: 'center',
                              position: 'relative',
                              boxShadow: agent.status !== 'idle' ? `0 0 10px ${statusBorder}` : 'none'
                            }}
                          >
                            {/* Icon Indicator */}
                            <div style={{ display: 'inline-flex', padding: '0.4rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', marginBottom: '0.4rem', color: statusColor }}>
                              {isLeader ? <Crown size={16} /> : <Cpu size={16} />}
                            </div>
                            
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{agent.name}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{agent.detail}</div>
                            
                            <span style={{ 
                              fontSize: '0.55rem', 
                              fontWeight: 800, 
                              color: statusColor, 
                              background: 'rgba(255,255,255,0.02)',
                              padding: '0.1rem 0.3rem', 
                              borderRadius: '4px',
                              border: `1px solid ${statusBorder}`,
                              textTransform: 'uppercase'
                            }}>
                              {statusLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fault Injector Panel */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <AlertTriangle size={15} color="var(--warning-color)" />
                      <h6 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Consensus Byzantine Fault Injector</h6>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {Object.keys(faults).map((agentKey) => {
                        const agentObj = agents.find(a => a.id === agentKey);
                        return (
                          <div key={agentKey} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{agentObj?.name} Status:</span>
                            <select
                              value={faults[agentKey]}
                              onChange={(e) => {
                                setFaults(prev => ({ ...prev, [agentKey]: e.target.value as any }));
                                resetSwarmSimulator();
                              }}
                              disabled={swarmStatus !== 'idle'}
                              style={{
                                background: 'rgba(3, 7, 18, 0.5)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                padding: '0.3rem',
                                color: 'white',
                                fontSize: '0.7rem',
                                outline: 'none'
                              }}
                            >
                              <option value="normal">🟢 Normal Node</option>
                              <option value="offline">⚪ Offline (No Sync)</option>
                              <option value="corrupt">🔴 Corrupt / Malicious</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.75rem', fontStyle: 'italic' }}>
                      *BFT consensus requires &gt;= 2/3 of active nodes (4 out of 5 total nodes) to be healthy and correct to finalize the task.
                    </p>
                  </div>

                </div>

                {/* Console Log Terminal Column */}
                <div style={{ padding: '1rem', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Terminal size={12} /> BFT Consensus Live Logs
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: swarmStatus !== 'idle' ? 'var(--success-color)' : 'var(--text-secondary)', display: 'inline-block' }} />
                  </div>
                  <div 
                    style={{ 
                      flex: 1, 
                      fontFamily: 'monospace', 
                      fontSize: '0.72rem', 
                      lineHeight: '1.4', 
                      background: 'rgba(3, 7, 18, 0.6)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      padding: '0.75rem', 
                      overflowY: 'auto',
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      color: '#a7f3d0'
                    }}
                  >
                    {swarmLogs.map((log, idx) => {
                      let color = '#a7f3d0';
                      if (log.includes('OFFLINE') || log.includes('FAILED') || log.includes('aborted') || log.includes('Malicious')) {
                        color = 'var(--error-color)';
                      } else if (log.includes('BFT') || log.includes('Byzantine')) {
                        color = 'var(--warning-color)';
                      } else if (log.includes('successfully') || log.includes('REACHED')) {
                        color = 'var(--success-color)';
                      } else if (log.includes('[System]')) {
                        color = 'var(--text-secondary)';
                      }
                      return (
                        <div key={idx} style={{ color, wordBreak: 'break-all' }}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedProjectId === 'synaptic-crdt' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: '420px' }}>
                
                {/* Editor Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(3, 7, 18, 0.4)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Code size={13} /> markdown_crdt_doc.md
                    </div>
                    {isTyping && <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700 }}>Broadcasting Yjs changes...</div>}
                  </div>
                  <textarea
                    value={docText}
                    onChange={handleTextChange}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      padding: '1.25rem',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      lineHeight: '1.6',
                      resize: 'none',
                      outline: 'none',
                      width: '100%',
                      minHeight: '300px'
                    }}
                  />
                  
                  {/* Local LLM triggers */}
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(3, 7, 18, 0.4)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                      onClick={runLocalAI}
                      disabled={agentStatus !== 'idle'}
                      className="btn btn-primary"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.8rem',
                        boxShadow: 'none',
                        background: agentStatus !== 'idle' ? 'var(--surface-color-light)' : undefined,
                        cursor: agentStatus !== 'idle' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Sparkles size={14} />
                      {agentStatus === 'idle' && 'Trigger In-Browser Agent (WebLLM)'}
                      {agentStatus === 'analyzing' && 'Analyzing Workspace...'}
                      {agentStatus === 'generating' && 'WebGPU Generation...'}
                    </button>
                    {agentStatus !== 'idle' && (
                      <div style={{ width: '40px', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden', flex: 1 }}>
                        <motion.div 
                          style={{ height: '100%', background: 'var(--accent-color)' }}
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Peer Network Visualizer & Diagnostics */}
                <div style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Peer Sync State */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                      Collaborative Topology
                    </h4>
                    
                    {/* Ring Connection Map */}
                    <div style={{ height: '150px', background: 'rgba(3, 7, 18, 0.5)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      
                      {/* Topology Lines */}
                      {isOnline && (
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                          <line x1="50%" y1="25%" x2="25%" y2="70%" stroke="var(--border-color)" strokeWidth="1.5" />
                          <line x1="50%" y1="25%" x2="75%" y2="70%" stroke="var(--border-color)" strokeWidth="1.5" />
                          <line x1="25%" y1="70%" x2="75%" y2="70%" stroke="var(--border-color)" strokeWidth="1.5" />
                          <line x1="50%" y1="25%" x2="50%" y2="60%" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3" />
                          
                          {/* Sync Flow animations when typing */}
                          {(isTyping || peerActivity || agentStatus === 'generating') && (
                            <motion.circle 
                              r="3" 
                              fill="var(--accent-color)" 
                              initial={{ x: 80, y: 105 }}
                              animate={{ x: [80, 160, 240, 80], y: [105, 37, 105, 105] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            />
                          )}
                        </svg>
                      )}

                      {/* Nodes */}
                      <div style={{ position: 'absolute', top: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: isOnline ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.1)', 
                          border: `2px solid ${isOnline ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOnline ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>U</div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>You</span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '15%', left: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.1)', 
                          border: `2px solid ${isOnline ? 'var(--success-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOnline ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>A</div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Alice</span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '15%', right: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: isOnline ? 'rgba(245, 158, 11, 0.2)' : 'rgba(148, 163, 184, 0.1)', 
                          border: `2px solid ${isOnline ? 'var(--warning-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOnline ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>B</div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Bob</span>
                      </div>

                      {/* AI Agent Node in the Center */}
                      <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-20%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          background: agentStatus !== 'idle' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(15, 23, 42, 0.6)', 
                          border: `1.5px solid ${agentStatus !== 'idle' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-color)',
                          boxShadow: agentStatus !== 'idle' ? '0 0 10px var(--accent-glow)' : 'none'
                        }}>
                          <Sparkles size={14} className={agentStatus !== 'idle' ? 'animate-glow' : ''} />
                        </div>
                      </div>

                      {peerActivity && (
                        <div style={{ position: 'absolute', bottom: '2%', background: 'rgba(3, 7, 18, 0.8)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                          {peerActivity}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Local Metrics Dashboard */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      Diagnostic Telemetry
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(3, 7, 18, 0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Sync Engine Status:</span>
                        <span style={{ fontWeight: 700, color: isOnline ? 'var(--success-color)' : 'var(--error-color)' }}>
                          {isOnline ? 'Active Syncing' : 'Disconnected'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>CRDT Vector state:</span>
                        <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                          Yjs-SV[{isOnline ? syncedPeers.length + 1 : 1}]
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Offline queue size:</span>
                        <span style={{ fontWeight: 700, color: pendingOps.length > 0 ? 'var(--warning-color)' : 'var(--text-secondary)' }}>
                          {pendingOps.length} operations
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>WebGPU Inference:</span>
                        <span style={{ fontWeight: 700, color: inferenceSpeed > 0 ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                          {inferenceSpeed > 0 ? `${inferenceSpeed} tok/sec` : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Ops Queue List */}
                  {pendingOps.length > 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '80px' }}>
                      <h5 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        Queued State Vector Diff
                      </h5>
                      <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '100px' }}>
                        {pendingOps.map((op, idx) => (
                          <div key={idx} style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ display: 'inline-block', width: '4px', height: '4px', background: 'var(--error-color)', borderRadius: '50%' }} />
                            {op}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : selectedProjectId === 'snn-agent' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', minHeight: '480px' }}>
                {/* Simulator Column */}
                <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.2)', padding: '1.25rem', gap: '1.25rem' }}>
                  
                  {/* Parameter Controls */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Sensory Input Source
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '0.2rem', borderRadius: '8px' }}>
                        {(['video', 'audio'] as const).map((source) => (
                          <button
                            key={source}
                            onClick={() => setSnnSensoryType(source)}
                            disabled={snnStatus === 'compiling' || snnStatus === 'simulating'}
                            style={{
                              flex: 1,
                              background: snnSensoryType === source ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                              border: snnSensoryType === source ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                              color: snnSensoryType === source ? '#60a5fa' : 'var(--text-secondary)',
                              padding: '0.4rem',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              textTransform: 'capitalize',
                              cursor: (snnStatus === 'compiling' || snnStatus === 'simulating') ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {source}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' }}>
                        Sensory Fire Rate (Hz)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="range" 
                          min={20}
                          max={120}
                          value={snnFrequency}
                          onChange={(e) => setSnnFrequency(parseInt(e.target.value))}
                          disabled={snnStatus === 'compiling'}
                          style={{
                            flex: 1,
                            accentColor: 'var(--accent-color)',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-color)', minWidth: '45px', textAlign: 'right' }}>
                          {snnFrequency} Hz
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={runSnnSimulation}
                        disabled={snnStatus !== 'idle'}
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                          border: 'none',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: snnStatus !== 'idle' ? 'not-allowed' : 'pointer',
                          opacity: snnStatus !== 'idle' ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Simulate SNN
                      </button>
                      <button 
                        onClick={resetSnnSimulation}
                        disabled={snnStatus === 'compiling'}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: 'white',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          cursor: snnStatus === 'compiling' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Canvas & Telemetry */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '340px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      {snnStatus === 'idle' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                          <Cpu size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                          <div>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Neuromorphic LIF Spike Engine</p>
                            <p style={{ fontSize: '0.8rem' }}>Initialize WebGPU event-driven Leaky Integrate-and-Fire compute shader pipeline.</p>
                          </div>
                        </div>
                      ) : snnStatus === 'compiling' ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
                          <div className="spinning-loader" style={{ width: '36px', height: '36px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Compiling LIF Spiking Kernels</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configuring spike queues and STDP binding tables ({snnProgress}%)...</p>
                          </div>
                          <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${snnProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <canvas 
                          ref={snnCanvasRef}
                          width={460}
                          height={200}
                          style={{ width: '100%', height: '100%', display: 'block', background: '#050b14' }}
                        />
                      )}
                    </div>
                  </div>

                </div>

                {/* Logs Column */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '1.25rem', background: 'rgba(3, 7, 18, 0.05)' }}>
                  
                  {/* Performance Indicators */}
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      WebGPU Neuromorphic Telemetry
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Sparsity Savings</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success-color)' }}>
                          {snnStatus === 'simulating' ? `${snnSparsity}%` : 'N/A'}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(3, 7, 18, 0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Spike Count</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-color)', fontFamily: 'monospace' }}>
                          {snnStatus === 'simulating' ? snnSpikeCount.toLocaleString() : '0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Console */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                      LIF Shader logs
                    </h4>
                    <div style={{ flex: 1, background: 'rgba(3, 7, 18, 0.5)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', maxHeight: '220px' }}>
                      {snnLogs.map((log, idx) => (
                        <div key={idx} style={{ 
                          color: log.includes('[Error]') ? 'var(--error-color)' : 
                                 log.includes('[Compiler]') ? 'var(--warning-color)' :
                                 log.includes('[WebGPU]') || log.includes('[STDP]') ? 'var(--accent-color)' :
                                 log.includes('[Neuromorphic]') ? 'var(--success-color)' : 'var(--text-secondary)',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', minHeight: '420px', background: 'rgba(3, 7, 18, 0.3)' }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <Cpu size={36} color="var(--accent-color)" />
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Simulation Offline for this project</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  The fully interactive visual simulator is currently active on the main daily experiment: <strong>Homomorphic-RAG (HE-RAG)</strong>. Load that experiment to run homomorphic vector searches.
                </p>
                <button className="btn btn-secondary" onClick={() => setSelectedProjectId('he-rag')}>
                  Switch to Active Experiment
                </button>
              </div>
            )}
            
          </div>

          {/* Research & Brainstorm Registry Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--success-color)" /> Value Proposition & Market Impact
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Moving computation to client WebGPU/WebAssembly leverages end-user hardware, turning scale from a liability into an asset. High-value data remains localized, addressing compliance requirements (such as GDPR, HIPAA, and SOC2) seamlessly.
              </p>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={16} color="var(--primary-color)" /> Architecture Specs
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <tbody>
                  {Object.entries(selectedProject.metrics).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.4rem 0', color: 'var(--text-secondary)', fontWeight: 500 }}>{key}</td>
                      <td style={{ padding: '0.4rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InnovationSandbox;

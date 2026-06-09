import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Wifi, WifiOff, Play, Terminal, Code, Sparkles, ShieldCheck, Database, Layers, Check, Crown, AlertTriangle, Coins } from 'lucide-react';
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
    id: 'liquid-agent',
    date: 'June 09, 2026 (Today)',
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

const InnovationSandbox = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('liquid-agent');
  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

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

  // Stats logs
  const [inferenceSpeed, setInferenceSpeed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<any>(null);

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

  const triggerFlash = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

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
            {selectedProjectId === 'liquid-agent' ? (
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

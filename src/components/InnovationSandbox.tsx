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
    id: 'depin-billing',
    date: 'June 07, 2026 (Today)',
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
  const [selectedProjectId, setSelectedProjectId] = useState('depin-billing');
  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

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
            {selectedProjectId === 'depin-billing' ? (
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

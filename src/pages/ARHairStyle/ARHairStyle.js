// ARHairStyle.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import Header from '../../components/Header/Header';
import './ARHairStyle.css';

const ARHairStyle = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const faceMeshRef = useRef(null);
  const animationRef = useRef(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedHairStyle, setSelectedHairStyle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [hairModels, setHairModels] = useState({});
  const [currentModel, setCurrentModel] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);

  // Колекція зачісок з шляхами до 3D моделей
  const hairStyles = [
    { 
      id: 1, 
      name: 'Long Waves', 
      type: 'women', 
      color: '#8B4513',
      modelPath: '/models/hairs/long_waves.glb',
      scale: 0.5,
      position: { x: 0, y: 0.3, z: 0 }
    },
    { 
      id: 2, 
      name: 'Short Bob', 
      type: 'women', 
      color: '#000000',
      modelPath: '/models/hairs/short_bob.glb',
      scale: 0.4,
      position: { x: 0, y: 0.2, z: 0 }
    },
    { 
      id: 3, 
      name: 'Curly Afro', 
      type: 'unisex', 
      color: '#2C1810',
      modelPath: '/models/hairs/curly_afro.glb',
      scale: 0.45,
      position: { x: 0, y: 0.25, z: 0 }
    },
    { 
      id: 4, 
      name: 'Undercut', 
      type: 'men', 
      color: '#1A1A1A',
      modelPath: '/models/hairs/undercut.glb',
      scale: 0.35,
      position: { x: 0, y: 0.15, z: 0 }
    },
    { 
      id: 5, 
      name: 'Fade', 
      type: 'men', 
      color: '#333333',
      modelPath: '/models/hairs/fade.glb',
      scale: 0.3,
      position: { x: 0, y: 0.1, z: 0 }
    },
    { 
      id: 6, 
      name: 'Pixie Cut', 
      type: 'women', 
      color: '#654321',
      modelPath: '/models/hairs/pixie_cut.glb',
      scale: 0.25,
      position: { x: 0, y: 0.05, z: 0 }
    },
    { 
      id: 7, 
      name: 'Braids', 
      type: 'women', 
      color: '#1A1A1A',
      modelPath: '/models/hairs/braids.glb',
      scale: 0.5,
      position: { x: 0, y: 0.3, z: 0 }
    },
    { 
      id: 8, 
      name: 'Man Bun', 
      type: 'men', 
      color: '#8B4513',
      modelPath: '/models/hairs/man_bun.glb',
      scale: 0.4,
      position: { x: 0, y: 0.2, z: 0 }
    },
  ];

  // Ініціалізація MediaPipe Face Mesh
  const initFaceMesh = () => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      handleFaceResults(results);
    });

    faceMeshRef.current = faceMesh;
  };

  // Обробка результатів розпізнавання обличчя
  const handleFaceResults = (results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setFaceDetected(true);
      
      if (currentModel && currentModel.userData.isHairModel) {
        updateHairPosition(results.multiFaceLandmarks[0]);
      }
    } else {
      setFaceDetected(false);
    }
  };

  // Оновлення позиції зачіски відповідно до обличчя
  const updateHairPosition = (landmarks) => {
    if (!landmarks || !currentModel) return;

    // Ключові точки обличчя для позиціонування
    const noseTip = landmarks[1];       // Кінчик носа
    const forehead = landmarks[10];     // Лоб
    const leftEar = landmarks[234];     // Ліве вухо
    const rightEar = landmarks[454];    // Праве вухо
    
    if (!noseTip || !forehead || !leftEar || !rightEar) return;
    
    // Обчислення центру голови
    const headCenter = {
      x: (leftEar.x + rightEar.x) / 2,
      y: (forehead.y + noseTip.y) / 2,
      z: (leftEar.z + rightEar.z) / 2
    };
    
    // Масштабування для Three.js
    const scale = 10;
    
    currentModel.position.set(
      headCenter.x * scale,
      -headCenter.y * scale + 2,
      headCenter.z * scale
    );
    
    // Автоматичний розмір відповідно до обличчя
    const faceWidth = Math.abs(leftEar.x - rightEar.x) * scale;
    const baseScale = selectedHairStyle?.scale || 0.3;
    const adaptiveScale = faceWidth * baseScale;
    
    currentModel.scale.set(adaptiveScale, adaptiveScale, adaptiveScale);
  };

  // Ініціалізація камери та AR
  const initCamera = async () => {
    try {
      setIsLoading(true);
      setShowStartButton(false);
      
      // Ініціалізація TensorFlow
      await tf.setBackend('webgl');
      await tf.ready();
      
      // Ініціалізація Face Mesh
      initFaceMesh();
      
      // Запит доступу до камери
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        
        // Початок обробки відео для розпізнавання обличчя
        startFaceDetection();
      }
      
      // Ініціалізація 3D сцени
      initThreeJS();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing AR:', error);
      setIsLoading(false);
      setShowStartButton(true);
      alert('Unable to initialize AR. Please check camera permissions.');
    }
  };

  // Запуск розпізнавання обличчя
  const startFaceDetection = () => {
    const detectFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && faceMeshRef.current) {
        try {
          await faceMeshRef.current.send({ image: videoRef.current });
        } catch (error) {
          console.error('Error in face detection:', error);
        }
      }
      if (isCameraActive) {
        animationRef.current = requestAnimationFrame(detectFrame);
      }
    };
    detectFrame();
  };

  // Ініціалізація Three.js сцени
  const initThreeJS = () => {
    if (!canvasRef.current) return;

    // Створення сцени
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Камера
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Освітлення
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0.5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, 0, -1);
    scene.add(backLight);

    // Анімаційний цикл
    const animate = () => {
      if (isCameraActive) {
        requestAnimationFrame(animate);
      }
      
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        // Плавне слідування за обличчям
        if (currentModel && faceDetected) {
          currentModel.rotation.y += 0.001;
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
  };

  // Завантаження 3D моделі зачіски
  const loadHairModel = async (hairStyle) => {
    if (!sceneRef.current) return;

    setSelectedHairStyle(hairStyle);
    
    // Видалення попередньої моделі
    if (currentModel) {
      sceneRef.current.remove(currentModel);
      setCurrentModel(null);
    }

    // Перевірка чи модель вже завантажена
    if (hairModels[hairStyle.id]) {
      const modelClone = hairModels[hairStyle.id].clone();
      modelClone.userData.isHairModel = true;
      sceneRef.current.add(modelClone);
      setCurrentModel(modelClone);
      return;
    }

    // Завантаження нової моделі
    setIsLoading(true);
    
    try {
      const loader = new GLTFLoader();
      
      loader.load(
        hairStyle.modelPath,
        (gltf) => {
          const model = gltf.scene;
          model.userData.isHairModel = true;
          model.scale.set(hairStyle.scale, hairStyle.scale, hairStyle.scale);
          model.position.set(
            hairStyle.position.x,
            hairStyle.position.y,
            hairStyle.position.z
          );
          
          // Оптимізація матеріалів
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.transparent = true;
              child.material.opacity = 0.9;
              child.material.depthWrite = false;
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Застосування кольору
              if (child.material.color) {
                child.material.color.setStyle(hairStyle.color);
              }
            }
          });
          
          // Збереження моделі в кеш
          setHairModels(prev => ({
            ...prev,
            [hairStyle.id]: model.clone()
          }));
          
          sceneRef.current.add(model);
          setCurrentModel(model);
          setIsLoading(false);
        },
        (progress) => {
          // Прогрес завантаження
          console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
        },
        (error) => {
          console.error('Error loading 3D model:', error);
          createFallbackHairModel(hairStyle);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error in loadHairModel:', error);
      createFallbackHairModel(hairStyle);
      setIsLoading(false);
    }
  };

  // Створення простої моделі як запасного варіанту
  const createFallbackHairModel = (hairStyle) => {
    const group = new THREE.Group();
    group.userData.isHairModel = true;
    
    // Базова форма зачіски
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: hairStyle.color,
      transparent: true,
      opacity: 0.8,
      metalness: 0.2,
      roughness: 0.7
    });
    
    const hairMesh = new THREE.Mesh(geometry, material);
    hairMesh.position.y = 0.3;
    
    // Додаткові деталі
    const detailGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
    for (let i = 0; i < 6; i++) {
      const detail = new THREE.Mesh(detailGeometry, material);
      detail.position.set(
        Math.cos(i * Math.PI / 3) * 0.3,
        0.2,
        Math.sin(i * Math.PI / 3) * 0.3
      );
      detail.rotation.x = Math.PI / 4;
      group.add(detail);
    }
    
    group.add(hairMesh);
    group.scale.set(hairStyle.scale, hairStyle.scale, hairStyle.scale);
    
    sceneRef.current.add(group);
    setCurrentModel(group);
  };

  // Зміна кольору зачіски
  const changeHairColor = (color) => {
    if (currentModel && selectedHairStyle) {
      currentModel.traverse((child) => {
        if (child.isMesh && child.material) {
          if (child.material.color) {
            child.material.color.setStyle(color);
          }
        }
      });
      
      // Оновлення стилю з новим кольором
      setSelectedHairStyle(prev => ({
        ...prev,
        color: color
      }));
    }
  };

  // Зупинка камери та очищення
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsCameraActive(false);
    setFaceDetected(false);
    setShowStartButton(true);
    
    // Очищення сцени
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
    }
    
    setCurrentModel(null);
  };

  // Ефект очищення
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && rendererRef.current && cameraRef.current) {
        cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stopCamera();
    };
  }, []);

  return (
    <div className="ar-hair-page">
      <Header />
      
      <div className="ar-container">
        <h1 className="ar-title">AR Hair Try-On</h1>
        <p className="ar-subtitle">
          Real-time augmented reality hairstyle preview
        </p>

        <div className="ar-content">
          {/* Ліва частина - AR перегляд */}
          <div className="ar-view-section">
            <div className="camera-container">
              {/* Відео потік з камери */}
              <video
                ref={videoRef}
                className={`camera-video ${isCameraActive ? 'active' : ''}`}
                playsInline
                muted
              />
              
              {/* Canvas для 3D моделей */}
              <canvas
                ref={canvasRef}
                className="ar-canvas"
              />
              
              {/* КНОПКА СТАРТ КАМЕРИ */}
              {showStartButton && !isCameraActive && (
                <div className="camera-start-overlay">
                  <div className="start-overlay-content">
                    <div className="start-icon">👁️</div>
                    <h3>AR Camera Ready</h3>
                    <p>Click below to start the augmented reality experience</p>
                    <button 
                      className="start-ar-btn"
                      onClick={initCamera}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner"></span>
                          Initializing AR...
                        </>
                      ) : (
                        '🚀 Start AR Camera'
                      )}
                    </button>
                    <p className="start-hint">
                      Make sure to allow camera access when prompted
                    </p>
                  </div>
                </div>
              )}
              
              {/* Статуси */}
              {isCameraActive && (
                <>
                  <div className="ar-status">
                    <div className={`status-indicator ${faceDetected ? 'detected' : 'searching'}`}>
                      <span className="status-dot" />
                      {faceDetected ? 'Face Detected' : 'Searching for Face...'}
                    </div>
                    {selectedHairStyle && (
                      <div className="current-hair-status">
                        Active: <strong>{selectedHairStyle.name}</strong>
                      </div>
                    )}
                  </div>
                  
                  {/* Інструкції */}
                  <div className="ar-instructions">
                    <h3>AR Instructions:</h3>
                    <ol>
                      <li>Sit in good lighting</li>
                      <li>Keep face in frame</li>
                      <li>Move slowly for tracking</li>
                      <li>Select hairstyle from panel</li>
                    </ol>
                  </div>
                </>
              )}
            </div>

            {/* Елементи управління AR */}
            {isCameraActive && (
              <div className="ar-controls">
                <div className="control-group">
                  <h4>Model Controls</h4>
                  <div className="control-buttons">
                    <button 
                      className="control-btn"
                      onClick={() => {
                        if (currentModel) currentModel.rotation.y += 0.5;
                      }}
                    >
                      ↻ Rotate
                    </button>
                    <button 
                      className="control-btn"
                      onClick={() => {
                        if (cameraRef.current) {
                          cameraRef.current.position.z = Math.max(1, cameraRef.current.position.z - 0.5);
                        }
                      }}
                    >
                      🔍 Zoom In
                    </button>
                    <button 
                      className="control-btn"
                      onClick={() => {
                        if (cameraRef.current) {
                          cameraRef.current.position.z = Math.min(10, cameraRef.current.position.z + 0.5);
                        }
                      }}
                    >
                      🔎 Zoom Out
                    </button>
                  </div>
                </div>
                
                <div className="control-group">
                  <h4>Color Controls</h4>
                  <div className="color-picker">
                    {['#8B4513', '#000000', '#2C1810', '#654321', '#A0522D', '#D2691E', '#1A1A1A', '#333333'].map(color => (
                      <button
                        key={color}
                        className="color-btn"
                        style={{ backgroundColor: color }}
                        onClick={() => changeHairColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                <button 
                  className="control-btn stop-btn"
                  onClick={stopCamera}
                >
                  ⏹️ Stop AR
                </button>
              </div>
            )}
          </div>

          {/* Права частина - вибір зачісок */}
          <div className="hair-selection-section">
            <h2 className="selection-title">Hairstyle Collection</h2>
            
            <div className="hair-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Women</button>
              <button className="filter-btn">Men</button>
              <button className="filter-btn">Short</button>
              <button className="filter-btn">Long</button>
              <button className="filter-btn">Curly</button>
            </div>

            <div className="hair-styles-grid">
              {hairStyles.map((style) => (
                <div 
                  key={style.id}
                  className={`hair-style-card ${selectedHairStyle?.id === style.id ? 'selected' : ''}`}
                  onClick={() => loadHairModel(style)}
                >
                  <div className="hair-preview-container">
                    <div 
                      className="hair-preview"
                      style={{ 
                        backgroundColor: style.color,
                        '--hair-color': style.color,
                        '--hair-color-dark': style.color + '80'
                      }}
                    >
                      <div className="hair-preview-text">
                        {style.name.charAt(0)}
                      </div>
                    </div>
                    <div className="model-badge">3D</div>
                  </div>
                  <div className="hair-info">
                    <h3>{style.name}</h3>
                    <p className="hair-type">{style.type}</p>
                    <div className="hair-stats">
                      <span className="stat">Scale: {style.scale}</span>
                      <span className="stat">3D Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Інформація про вибрану модель */}
            {selectedHairStyle && (
              <div className="selected-hair-info">
                <h3>Current Model</h3>
                <div className="selected-hair-card">
                  <div 
                    className="selected-hair-color"
                    style={{ backgroundColor: selectedHairStyle.color }}
                  />
                  <div className="selected-hair-details">
                    <h4>{selectedHairStyle.name}</h4>
                    <p><strong>Path:</strong> {selectedHairStyle.modelPath}</p>
                    <p><strong>Scale:</strong> {selectedHairStyle.scale}</p>
                    <div className="model-actions">
                      <button 
                        className="action-btn"
                        onClick={() => {
                          if (currentModel) {
                            currentModel.visible = !currentModel.visible;
                          }
                        }}
                      >
                        {currentModel?.visible ? '👁️ Hide' : '👁️ Show'}
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => {
                          if (currentModel) {
                            currentModel.scale.multiplyScalar(1.1);
                          }
                        }}
                      >
                        📈 Enlarge
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => {
                          if (currentModel) {
                            currentModel.scale.multiplyScalar(0.9);
                          }
                        }}
                      >
                        📉 Shrink
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Інформація про систему */}
            <div className="ar-info">
              <h3>AR System Info</h3>
              <div className="system-stats">
                <div className="stat-item">
                  <span className="static-label">Camera Status:</span>
                  <span className={`stat-value ${isCameraActive ? 'active' : 'inactive'}`}>
                    {isCameraActive ? 'Active' : 'Ready to Start'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="static-label">Face Tracking:</span>
                  <span className={`stat-value ${faceDetected ? 'active' : 'inactive'}`}>
                    {faceDetected ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="static-label">3D Models Loaded:</span>
                  <span className="stat-value">{Object.keys(hairModels).length}</span>
                </div>
              </div>
              
              <div className="tech-stack">
                <h4>Technology Stack:</h4>
                <div className="tech-tags">
                  <span className="tech-tag">Three.js</span>
                  <span className="tech-tag">MediaPipe</span>
                  <span className="tech-tag">TensorFlow.js</span>
                  <span className="tech-tag">WebGL</span>
                  <span className="tech-tag">GLTF</span>
                </div>
              </div>
              
              <div className="setup-guide">
                <h4>How to Add Your Models:</h4>
                <ol>
                  <li>Create 3D models in Blender</li>
                  <li>Export as .glb or .gltf</li>
                  <li>Place in /public/models/hairs/</li>
                  <li>Update modelPath in hairStyles array</li>
                  <li>Adjust scale and position values</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARHairStyle;
// DOM要素の取得
const sceneryContainer = document.getElementById('sceneryContainer');
const sceneryImage = document.getElementById('sceneryImage');
const sceneTitle = document.getElementById('sceneTitle');
const sceneLocation = document.getElementById('sceneLocation');
const sceneDescription = document.getElementById('sceneDescription');
const dateDisplay = document.getElementById('dateDisplay');
const infoPanel = document.getElementById('infoPanel');
const pullIndicator = document.getElementById('pullIndicator');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// 現在表示している絶景のインデックス
let currentIndex = 0;

// タッチイベント用の変数
let touchStartX = 0;
let touchEndX = 0;

// 初期ロード
window.addEventListener('DOMContentLoaded', function() {
  // 今日の日付に最も近い絶景を表示
  const today = new Date().toISOString().split('T')[0];
  const todayScenery = sceneryData.find(item => item.date === today);
  
  if (todayScenery) {
    currentIndex = sceneryData.indexOf(todayScenery);
  }
  
  loadScenery(currentIndex);
  
  // スワイプ機能の初期化
  initSwipeDetection();
  
  // 情報パネルのトグル機能
  pullIndicator.addEventListener('click', function() {
    infoPanel.classList.toggle('expanded');
  });
  
  // ナビゲーションボタンの設定
  prevButton.addEventListener('click', function() {
    goToPreviousScenery();
  });
  
  nextButton.addEventListener('click', function() {
    goToNextScenery();
  });
  
  // キーボードナビゲーション
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      goToPreviousScenery();
    } else if (e.key === 'ArrowRight') {
      goToNextScenery();
    }
  });
});

// 指定したインデックスの絶景を読み込む
function loadScenery(index) {
  if (index < 0 || index >= sceneryData.length) {
    return false;
  }
  
  // ローディング表示
  loadingIndicator.style.display = 'flex';
  
  const scenery = sceneryData[index];
  
  // 画像の読み込みが完了したらコンテンツを表示
  const img = new Image();
  img.onload = function() {
    sceneryImage.src = scenery.imageUrl;
    sceneTitle.textContent = scenery.title;
    sceneLocation.textContent = scenery.location;
    sceneDescription.textContent = scenery.description;
    
    // 日付の表示
    const formattedDate = formatDate(scenery.date);
    dateDisplay.textContent = formattedDate;
    
    // ローディング非表示
    loadingIndicator.style.display = 'none';
  };
  
img.onerror = function() {
  // 画像読み込みエラーの場合
  // プレースホルダー画像を表示しない
  sceneryImage.style.display = 'none';
  
  // ローディング表示を残す（テキストのみ）
  loadingIndicator.style.display = 'flex';
  loadingIndicator.innerHTML = '<p>美しい絶景をお楽しみください</p>';
  
  console.error('画像の読み込みに失敗しました');
};

// 成功時の処理
img.onload = function() {
  // 正常に読み込めた場合は画像を表示
  sceneryImage.style.display = 'block';
  sceneryImage.src = scenery.imageUrl;
  
  // ローディング表示を非表示
  loadingIndicator.style.display = 'none';
};
  
  img.src = scenery.imageUrl;
  currentIndex = index;
  
  return true;
}

// 前の絶景に移動
function goToPreviousScenery() {
  if (loadScenery(currentIndex - 1)) {
    // 右からスライドインするアニメーション
    sceneryContainer.style.transform = 'translateX(100%)';
    setTimeout(() => {
      sceneryContainer.style.transition = 'none';
      sceneryContainer.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        sceneryContainer.style.transition = 'transform 0.5s ease-out';
        sceneryContainer.style.transform = 'translateX(0)';
      }, 50);
    }, 50);
  }
}

// 次の絶景に移動
function goToNextScenery() {
  if (loadScenery(currentIndex + 1)) {
    // 左からスライドインするアニメーション
    sceneryContainer.style.transform = 'translateX(-100%)';
    setTimeout(() => {
      sceneryContainer.style.transition = 'none';
      sceneryContainer.style.transform = 'translateX(100%)';
      setTimeout(() => {
        sceneryContainer.style.transition = 'transform 0.5s ease-out';
        sceneryContainer.style.transform = 'translateX(0)';
      }, 50);
    }, 50);
  }
}

// スワイプ検出の初期化
function initSwipeDetection() {
  sceneryContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  sceneryContainer.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
}

// スワイプ処理
function handleSwipe() {
  const swipeThreshold = 100; // スワイプと判定する最小ピクセル数
  
  if (touchEndX < touchStartX - swipeThreshold) {
    // 左スワイプ -> 次の絶景
    goToNextScenery();
  } else if (touchEndX > touchStartX + swipeThreshold) {
    // 右スワイプ -> 前の絶景
    goToPreviousScenery();
  }
}

// 日付のフォーマット
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ja-JP', options);
}

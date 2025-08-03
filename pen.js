// ========== نظام الإنجاز اليومي المعدل ==========
const achievementSystem = {
  elements: {
    progressBar: document.querySelector(".level-fill"),
    waterBtn: document.getElementById("waterBtn"),
    completedTasksEl: document.getElementById("completedTasks"),
    currentLevelEl: document.getElementById("currentLevel"),
    tree: document.getElementById("tree"),
    leaves: document.querySelector(".leaves"),
    fruits: document.querySelector(".fruits"),
    levelDots: document.querySelectorAll(".level-dot"),
  },

  data: JSON.parse(localStorage.getItem("achievementData")) || {
    completedTasks: 0,
    level: 1,
    waterCount: 0,
    totalTasksCompleted: 0,
  },

  constants: {
    TASKS_PER_LEVEL: 10,
    WATER_NEEDED: 3,
    GROWTH_PER_LEVEL: 10,
  },

  init: function () {
    this.setupEventListeners();
    this.updateUI();
    this.updateLevelDots();
  },

  setupEventListeners: function () {
    this.elements.waterBtn.addEventListener("click", () => this.waterTree());

    // يمكنك إضافة هذا الحدث عند إكمال المهام في تطبيقك
    document.addEventListener("taskCompleted", (e) => {
      this.handleTaskCompletion(e.detail.tasksCount);
    });
  },

  handleTaskCompletion: function (count) {
    this.data.completedTasks += count;
    this.data.totalTasksCompleted += count;

    this.checkLevelUp();
    this.saveData();
    this.updateUI();

    if (this.data.completedTasks >= 3) {
      this.elements.waterBtn.disabled = false;
      this.elements.waterBtn.textContent =
        this.elements.waterBtn.getAttribute("data-lang-ar");
    }
  },

  checkLevelUp: function () {
    const tasksNeeded = this.data.level * this.constants.TASKS_PER_LEVEL;

    if (this.data.totalTasksCompleted >= tasksNeeded) {
      this.data.level++;
      this.data.completedTasks = 0;
      this.updateLevelDots();
      this.growTree();
      this.showLevelUpNotification();
      this.saveData();
      this.updateUI();
    }
  },

  waterTree: function () {
    if (this.data.completedTasks < 3) {
      this.showNotification(
        `تحتاج إلى ${3 - this.data.completedTasks} مهام أخرى لسقي الشجرة`
      );
      return;
    }

    this.data.waterCount++;
    this.data.completedTasks -= 3;

    if (this.data.waterCount >= this.constants.WATER_NEEDED) {
      this.showFruits();
    }

    this.saveData();
    this.updateUI();
    this.animateTree();
  },

  showFruits: function () {
    this.elements.fruits.classList.remove("hidden");
    this.elements.waterBtn.disabled = true;
    this.elements.waterBtn.textContent = "لقد أثمرت الشجرة!";
    this.data.waterCount = 0;
  },

  growTree: function () {
    const growthPercentage =
      100 + (this.data.level - 1) * this.constants.GROWTH_PER_LEVEL;
    this.elements.leaves.style.transform = `scale(${growthPercentage / 100})`;
  },

  animateTree: function () {
    this.elements.tree.classList.add("shake");
    setTimeout(() => {
      this.elements.tree.classList.remove("shake");
    }, 500);
  },

  updateLevelDots: function () {
    this.elements.levelDots.forEach((dot) => {
      const dotLevel = parseInt(dot.getAttribute("data-level"));
      dot.classList.toggle("active", dotLevel <= this.data.level);

      // تحديث النص حسب المستوى
      if (dotLevel === this.data.level) {
        dot.textContent = dot.getAttribute("data-lang-ar");
      }
    });
  },

  updateUI: function () {
    // تحديث شريط التقدم
    const progressPercent =
      (this.data.completedTasks % this.constants.TASKS_PER_LEVEL) *
      (100 / this.constants.TASKS_PER_LEVEL);
    this.elements.progressBar.style.width = `${progressPercent}%`;
    this.elements.progressBar.setAttribute("data-level", this.data.level);

    // تحديث العدادات
    this.elements.completedTasksEl.textContent = this.data.completedTasks;
    this.elements.currentLevelEl.textContent = this.data.level;

    // تحديث زر السقي
    this.elements.waterBtn.disabled = this.data.completedTasks < 3;
    this.elements.waterBtn.textContent =
      this.data.completedTasks >= 3
        ? this.elements.waterBtn.getAttribute("data-lang-ar")
        : `أكمل ${3 - this.data.completedTasks} مهام أخرى`;
  },

  showNotification: function (message) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  showLevelUpNotification: function () {
    const notification = document.createElement("div");
    notification.className = "level-up-notification";
    notification.innerHTML = `
      <h3>تهانينا! 🎉</h3>
      <p>لقد وصلت إلى المستوى ${this.data.level}</p>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  },

  saveData: function () {
    localStorage.setItem("achievementData", JSON.stringify(this.data));
  },
};

// ========== التهيئة عند تحميل الصفحة ==========
document.addEventListener("DOMContentLoaded", () => {
  achievementSystem.init();
});

// ========== دالة مساعدة للاختبار ==========
function completeTask(count = 1) {
  const event = new CustomEvent("taskCompleted", {
    detail: { tasksCount: count },
  });
  document.dispatchEvent(event);
}

// الشعارات و الاصوات
// ===== نظام الإشعارات والأصوات =====
// ===== نظام الإشعارات والأصوات =====
const notificationSystem = {
  // عناصر DOM
  elements: {
    playBtn: document.getElementById("play-btn"),
    resetBtn: document.getElementById("reset-btn"),
    notificationContainer: document.createElement("div"),
  },

  // مصادر الصوت (يمكن استبدالها بملفاتك الخاصة)
  sounds: {
    timerEnd: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"
    ),
    taskComplete: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
    ),
    buttonClick: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3"
    ),
  },

  // تهيئة النظام
  init: function () {
    this.setupDOM();
    this.setupEventListeners();
    this.requestNotificationPermission();
  },

  // إعداد عناصر DOM للإشعارات
  setupDOM: function () {
    this.elements.notificationContainer.id = "notification-system";
    this.elements.notificationContainer.style.position = "fixed";
    this.elements.notificationContainer.style.top = "20px";
    this.elements.notificationContainer.style.left = "20px";
    this.elements.notificationContainer.style.zIndex = "1000";
    document.body.appendChild(this.elements.notificationContainer);
  },

  // إعداد مستمعي الأحداث
  setupEventListeners: function () {
    // أصوات الأزرار
    this.elements.playBtn.addEventListener("click", () =>
      this.playSound("buttonClick")
    );
    this.elements.resetBtn.addEventListener("click", () =>
      this.playSound("buttonClick")
    );

    // ربط حدث إكمال المهمة
    document.addEventListener("taskCompleted", () => {
      this.showTaskCompleteNotification();
      this.playSound("taskComplete");
    });
  },

  // طلب إذن الإشعارات
  requestNotificationPermission: function () {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("حالة إذن الإشعارات:", permission);
      });
    }
  },

  // عرض إشعار انتهاء الوقت
  showTimerEndNotification: function () {
    // الإشعار الداخلي
    this.showInternalNotification(
      "⏰ انتهاء الوقت",
      "لقد انتهى الوقت المحدد للمهمة"
    );

    // الإشعار الخارجي (إذا كان مسموحاً)
    if (Notification.permission === "granted") {
      new Notification("انتهاء الوقت", {
        body: "لقد انتهى الوقت المحدد للمهمة",
        icon: "icon.png",
        dir: "rtl",
      });
    }

    // تشغيل صوت الجرس
    this.playSound("timerEnd");
  },

  // عرض إشعار إكمال المهمة
  showTaskCompleteNotification: function () {
    // الإشعار الداخلي
    this.showInternalNotification("🎉 تهانينا!", "لقد أكملت المهمة بنجاح");

    // الإشعار الخارجي (إذا كان مسموحاً)
    if (Notification.permission === "granted") {
      new Notification("مهمة مكتملة", {
        body: "لقد أكملت المهمة بنجاح",
        icon: "icon.png",
        dir: "rtl",
      });
    }
  },

  // عرض إشعار داخلي
  showInternalNotification: function (title, message) {
    const notification = document.createElement("div");
    notification.className = "internal-notification";
    notification.innerHTML = `
      <h3 style="margin:0 0 5px 0;font-size:18px;">${title}</h3>
      <p style="margin:0;font-size:14px;">${message}</p>
    `;

    this.elements.notificationContainer.appendChild(notification);

    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
      notification.style.animation = "fadeOut 0.5s forwards";
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  },

  // تشغيل الصوت مع معالجة الأخطاء
  playSound: function (soundType) {
    try {
      // إعادة تعيين الصوت إذا كان مشغلاً
      this.sounds[soundType].currentTime = 0;

      // محاولة التشغيل
      this.sounds[soundType].play().catch((error) => {
        console.error("تعذر تشغيل الصوت:", error);

        // حل بديل: تشغيل الصوت بعد تفاعل المستخدم
        if (error.name === "NotAllowedError") {
          const playOnClick = () => {
            this.sounds[soundType].play();
            document.body.removeEventListener("click", playOnClick);
          };
          document.body.addEventListener("click", playOnClick);
        }
      });
    } catch (error) {
      console.error("خطأ في تشغيل الصوت:", error);
    }
  },
};

// ===== تهيئة النظام عند تحميل الصفحة =====
document.addEventListener("DOMContentLoaded", () => {
  notificationSystem.init();

  // إضافة أنماط CSS ديناميكياً
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeOut {
      to { opacity: 0; transform: translateY(-20px); }
    }
    .internal-notification {
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 10px;
      animation: slideIn 0.5s forwards;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
});

// ===== أمثلة لاستخدام النظام =====

// 1. عند انتهاء الوقت:
function timerFinished() {
  notificationSystem.showTimerEndNotification();
}

// 2. عند إكمال مهمة:
function completeTask() {
  const event = new Event("taskCompleted");
  document.dispatchEvent(event);
}

// 3. لاختبار النظام:
function testNotifications() {
  // اختبار إشعار انتهاء الوقت
  notificationSystem.showTimerEndNotification();

  // اختبار إشعار إكمال المهمة بعد 2 ثانية
  setTimeout(() => {
    const event = new Event("taskCompleted");
    document.dispatchEvent(event);
  }, 2000);
}

// اغلاق الاعلان



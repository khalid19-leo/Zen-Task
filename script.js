// ========== Clock Code ==========
const clockElements = {
  hoursFace: document.getElementById("hours-face"),
  hoursFlip: document.getElementById("hours-flip"),
  minutesFace: document.getElementById("minutes-face"),
  minutesFlip: document.getElementById("minutes-flip"),
  secondsFace: document.getElementById("seconds-face"),
  secondsFlip: document.getElementById("seconds-flip"),
  playBtn: document.getElementById("play-btn"),
  resetBtn: document.getElementById("reset-btn"),
  hoursInput: document.getElementById("hours-input"),
  minutesInput: document.getElementById("minutes-input"),
  secondsInput: document.getElementById("seconds-input"),
  clockSection: document.querySelector(".clock-section"),

  // Audio Library Elements
  audioSearchInput: document.getElementById("audio-search"),
  audioListContainer: document.getElementById("audio-list"),
  reciterSelect: document.getElementById("reciter-select"),
  volumeBar: document.getElementById("volume-bar"),
  filterButtons: document.querySelectorAll(".filter-btn"),
};

const clockState = {
  time: { hours: 0, minutes: 0, seconds: 0 },
  isRunning: false,
  timerInterval: null,
  alarmSound: new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"
  ),
  taskCompleteSound: new Audio(
    "https://cdn.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3"
  ),
  wateringSound: new Audio(
    "https://cdn.mixkit.co/sfx/preview/mixkit-water-drop-1309.mp3"
  ),

  // المكتبة الصوتية مقسمة حسب الشيوخ
  quranLibrary: {
    minshawi: {
      AlFatiha: "https://server10.mp3quran.net/minsh/001.mp3",
      AlBaqarah: "https://server10.mp3quran.net/minsh/002.mp3",
      AlImran: "https://server10.mp3quran.net/minsh/003.mp3",
      AlNisa: "https://server10.mp3quran.net/minsh/004.mp3",
      AlMaida: "https://server10.mp3quran.net/minsh/005.mp3",
      AlAnam: "https://server10.mp3quran.net/minsh/006.mp3",
      AlAraf: "https://server10.mp3quran.net/minsh/007.mp3",
      AlAnfal: "https://server10.mp3quran.net/minsh/008.mp3",
      AlTawbah: "https://server10.mp3quran.net/minsh/009.mp3",
      Yunus: "https://server10.mp3quran.net/minsh/010.mp3",
      Luqman: "https://server10.mp3quran.net/minsh/031.mp3",
      Yaseen: "https://server10.mp3quran.net/minsh/036.mp3",
      AlFurqan: "https://server10.mp3quran.net/minsh/025.mp3",
      AlNoor: "https://server10.mp3quran.net/minsh/024.mp3",
      AlRum: "https://server10.mp3quran.net/minsh/030.mp3",
      AlInsan: "https://server10.mp3quran.net/minsh/076.mp3",
      AlQiyamah: "https://server10.mp3quran.net/minsh/075.mp3",
      AlHijr: "https://server10.mp3quran.net/minsh/015.mp3",
    },
    // يمكن إضافة المزيد من الشيوخ هنا
    alafasy: {
      AlFatiha: "https://server12.mp3quran.net/maher/001.mp3",
      AlBaqarah: "https://server12.mp3quran.net/maher/002.mp3",
      AlImran: "https://server12.mp3quran.net/maher/003.mp3",
      AlKahf: "https://server12.mp3quran.net/maher/018.mp3",
      Maryam: "https://server12.mp3quran.net/maher/019.mp3",
      Taha: "https://server12.mp3quran.net/maher/020.mp3",
      AlHajj: "https://server12.mp3quran.net/maher/022.mp3",
      AlMuminun: "https://server12.mp3quran.net/maher/023.mp3",
      Yasin: "https://server12.mp3quran.net/maher/036.mp3",
      AlRahman: "https://server12.mp3quran.net/maher/055.mp3",
    },
    abdulbasit: {
      AlFatiha: "https://server7.mp3quran.net/basit/001.mp3",
      AlBaqarah: "https://server7.mp3quran.net/basit/002.mp3",
      AlImran: "https://server7.mp3quran.net/basit/003.mp3",
      AlAraf: "https://server7.mp3quran.net/basit/007.mp3",
      Yusuf: "https://server7.mp3quran.net/basit/012.mp3",
      AlKahf: "https://server7.mp3quran.net/basit/018.mp3",
      Taha: "https://server7.mp3quran.net/basit/020.mp3",
      AlHajj: "https://server7.mp3quran.net/basit/022.mp3",
      Yasin: "https://server7.mp3quran.net/basit/036.mp3",
      AlMulk: "https://server7.mp3quran.net/basit/067.mp3",
    },
    aldossari: {
      AlFatiha: "https://server11.mp3quran.net/yasser/001.mp3",
      AlBaqarah: "https://server11.mp3quran.net/yasser/002.mp3",
      AlImran: "https://server11.mp3quran.net/yasser/003.mp3",
      AlKahf: "https://server11.mp3quran.net/yasser/018.mp3",
      Yasin: "https://server11.mp3quran.net/yasser/036.mp3",
      AlDukhan: "https://server11.mp3quran.net/yasser/044.mp3",
      AlRahman: "https://server11.mp3quran.net/yasser/055.mp3",
      AlWaqiah: "https://server11.mp3quran.net/yasser/056.mp3",
      AlMulk: "https://server11.mp3quran.net/yasser/067.mp3",
      AlAala: "https://server11.mp3quran.net/yasser/087.mp3",
    },
  },
  currentRecitation: null,
  currentAudioPlayer: new Audio(),
  selectedReciter: "minshawi", // القيمة الافتراضية
};

const clockFunctions = {
  updateDisplay: function () {
    const formatTime = (num) => num.toString().padStart(2, "0");

    clockElements.hoursFace.textContent = formatTime(clockState.time.hours);
    clockElements.hoursFlip.textContent = formatTime(clockState.time.hours);
    clockElements.minutesFace.textContent = formatTime(clockState.time.minutes);
    clockElements.minutesFlip.textContent = formatTime(clockState.time.minutes);
    clockElements.secondsFace.textContent = formatTime(clockState.time.seconds);
    clockElements.secondsFlip.textContent = formatTime(clockState.time.seconds);

    clockElements.hoursInput.value = formatTime(clockState.time.hours);
    clockElements.minutesInput.value = formatTime(clockState.time.minutes);
    clockElements.secondsInput.value = formatTime(clockState.time.seconds);
  },

  resetTimer: function () {
    this.pauseTimer();
    clockState.time = {
      hours: parseInt(clockElements.hoursInput.value) || 0,
      minutes: parseInt(clockElements.minutesInput.value) || 0,
      seconds: parseInt(clockElements.secondsInput.value) || 0,
    };
    this.updateDisplay();
  },

  flipAnimation: function (element, value, callback) {
    element.textContent = value;
    element.classList.add("flipping");

    setTimeout(() => {
      element.classList.remove("flipping");
      if (callback) callback();
    }, 600);
  },

  startTimer: function () {
    if (clockState.isRunning) return;

    clockState.isRunning = true;
    clockElements.playBtn.textContent = "❚❚";
    clockElements.playBtn.classList.add("active");

    clockState.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  },

  pauseTimer: function () {
    if (!clockState.isRunning) return;

    clockState.isRunning = false;
    clockElements.playBtn.textContent = "▶";
    clockElements.playBtn.classList.remove("active");
    clearInterval(clockState.timerInterval);
  },

  updateTimer: function () {
    if (clockState.time.seconds > 0) {
      clockState.time.seconds--;
      this.flipAnimation(
        clockElements.secondsFlip,
        (clockState.time.seconds + 1).toString().padStart(2, "0"),
        () => {
          clockElements.secondsFace.textContent = clockState.time.seconds
            .toString()
            .padStart(2, "0");
        }
      );
    } else {
      if (clockState.time.minutes > 0) {
        clockState.time.minutes--;
        clockState.time.seconds = 59;
        this.flipAnimation(
          clockElements.minutesFlip,
          (clockState.time.minutes + 1).toString().padStart(2, "0"),
          () => {
            clockElements.minutesFace.textContent = clockState.time.minutes
              .toString()
              .padStart(2, "0");
          }
        );
      } else {
        if (clockState.time.hours > 0) {
          clockState.time.hours--;
          clockState.time.minutes = 59;
          clockState.time.seconds = 59;
          this.flipAnimation(
            clockElements.hoursFlip,
            (clockState.time.hours + 1).toString().padStart(2, "0"),
            () => {
              clockElements.hoursFace.textContent = clockState.time.hours
                .toString()
                .padStart(2, "0");
            }
          );
        } else {
          this.pauseTimer();
          this.triggerAlarm();
          showTimerNotification();
          return;
        }
      }
    }
    this.updateDisplay();
  },

  triggerAlarm: function () {
    clockElements.clockSection.classList.add("alarm-shake");
    clockState.alarmSound.loop = true;
    clockState.alarmSound.play();

    const alarmNotification = document.createElement("div");
    alarmNotification.className = "pro-alarm-notification";
    alarmNotification.innerHTML = `
      <div class="alarm-content">
        <div class="alarm-icon">⏰</div>
        <div class="alarm-text">
          <h3>انتهى الوقت!</h3>
          <p>لقد أكملت جلسة العمل بنجاح</p>
        </div>
        <button id="stop-alarm" class="alarm-btn">
          <i class="bx bx-check"></i> تم
        </button>
      </div>
    `;
    document.body.appendChild(alarmNotification);

    document.getElementById("stop-alarm").addEventListener("click", () => {
      this.stopAlarm(alarmNotification);
    });

    setTimeout(() => {
      if (!clockState.alarmSound.paused) {
        this.stopAlarm(alarmNotification);
      }
    }, 30000);
  },

  stopAlarm: function (notificationElement) {
    clockState.alarmSound.pause();
    clockState.alarmSound.currentTime = 0;
    notificationElement.classList.add("fade-out");
    setTimeout(() => {
      notificationElement.remove();
    }, 500);
    clockElements.clockSection.classList.remove("alarm-shake");
  },

  // وظائف المكتبة الصوتية الجديدة
  playQuran: function (surahUrl) {
    if (clockState.currentAudioPlayer) {
      clockState.currentAudioPlayer.pause();
      clockState.currentAudioPlayer.currentTime = 0;
    }

    if (surahUrl) {
      clockState.currentAudioPlayer.src = surahUrl;
      clockState.currentAudioPlayer.play();
      clockState.currentAudioPlayer.volume =
        clockElements.volumeBar.value / 100;
    }
  },

  stopQuran: function () {
    if (clockState.currentAudioPlayer) {
      clockState.currentAudioPlayer.pause();
      clockState.currentAudioPlayer.currentTime = 0;
    }
  },

  // دالة تحديث قائمة السور
  updateAudioList: function (reciterKey, query = "") {
    const audioList = clockElements.audioListContainer;
    audioList.innerHTML = "";

    let surahsToShow = [];
    if (reciterKey === "all") {
      // جمع كل السور من كل الشيوخ إذا تم اختيار "كل الشيوخ"
      for (const reciter in clockState.quranLibrary) {
        const surahs = Object.keys(clockState.quranLibrary[reciter]);
        surahs.forEach((surahName) => {
          surahsToShow.push({
            name: surahName,
            url: clockState.quranLibrary[reciter][surahName],
          });
        });
      }
    } else {
      // عرض السور الخاصة بالشيخ المختار فقط
      const selectedReciterSurahs = clockState.quranLibrary[reciterKey];
      for (const surahName in selectedReciterSurahs) {
        surahsToShow.push({
          name: surahName,
          url: selectedReciterSurahs[surahName],
        });
      }
    }

    // فلترة السور بناءً على البحث
    const filteredSurahs = surahsToShow.filter((surah) =>
      surah.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredSurahs.length > 0) {
      filteredSurahs.forEach((surah) => {
        const surahItem = document.createElement("button");
        surahItem.className = "surah-item-btn";
        surahItem.innerHTML = `
            <i class="bx bx-play-circle"></i>
            <span>${surah.name.replace(/([A-Z])/g, " $1").trim()}</span>
        `;
        surahItem.addEventListener("click", () => {
          this.playQuran(surah.url);
        });
        audioList.appendChild(surahItem);
      });
    } else {
      audioList.innerHTML = "<p>لم يتم العثور على نتائج.</p>";
    }
  },
};

// ========== Todo List Code ==========
const todoApp = {
  elements: {
    form: document.getElementById("todo-form"),
    input: document.getElementById("todo-input"),
    list: document.getElementById("todo-list"),
  },
  todos: JSON.parse(localStorage.getItem("todos")) || [],

  renderTodos: function () {
    this.elements.list.innerHTML = "";

    this.todos.forEach((todo, index) => {
      const todoItem = document.createElement("li");
      todoItem.className = `todo-item fade-in ${
        todo.completed ? "completed" : ""
      }`;

      todoItem.innerHTML = `
        <div class="todo-content">
          <input type="checkbox" class="todo-checkbox" ${
            todo.completed ? "checked" : ""
          }>
          <span class="todo-text ${todo.completed ? "completed" : ""}">${
        todo.text
      }</span>
        </div>
        <button class="delete-btn" aria-label="حذف المهمة">
          <i class="bx bx-trash"></i>
        </button>
      `;

      const checkbox = todoItem.querySelector(".todo-checkbox");
      const deleteBtn = todoItem.querySelector(".delete-btn");
      const todoText = todoItem.querySelector(".todo-text");

      checkbox.addEventListener("change", () => {
        this.toggleTodo(index, checkbox.checked, todoItem, todoText);
      });

      deleteBtn.addEventListener("click", () => {
        this.deleteTodo(index, todoItem);
      });

      setTimeout(() => {
        todoItem.style.opacity = "1";
        todoItem.style.transform = "translateY(0)";
      }, 100 * index);

      this.elements.list.appendChild(todoItem);
    });
  },

  toggleTodo: function (index, isCompleted, todoItem, todoText) {
    this.todos[index].completed = isCompleted;
    todoItem.classList.toggle("completed");
    todoText.classList.toggle("completed");
    this.saveTodos();

    if (isCompleted) {
      clockState.taskCompleteSound.play();
      const taskCompletedEvent = new CustomEvent("taskCompleted", {
        detail: { tasksCount: 1 },
      });
      document.dispatchEvent(taskCompletedEvent);
    }
  },

  deleteTodo: function (index, todoItem) {
    todoItem.classList.add("fade-out");
    setTimeout(() => {
      this.todos.splice(index, 1);
      this.saveTodos();
      this.renderTodos();
    }, 500);
  },

  saveTodos: function () {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  },

  addTodo: function (e) {
    e.preventDefault();
    const text = this.elements.input.value.trim();

    if (!text) {
      this.elements.input.classList.add("error");
      setTimeout(() => {
        this.elements.input.classList.remove("error");
      }, 1000);
      return;
    }

    this.todos.push({
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    this.saveTodos();
    this.renderTodos();
    this.elements.input.value = "";
    this.elements.input.focus();
  },
};

// ========== Theme Toggle Code ==========
const themeManager = {
  elements: {
    toggle: document.getElementById("theme-toggle"),
    icon: document.getElementById("theme-icon"),
  },

  toggleTheme: function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      this.elements.icon.className = "bx bx-moon";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      this.elements.icon.className = "bx bx-sun";
    }
  },

  init: function () {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      this.elements.icon.className = "bx bx-sun";
    } else {
      this.elements.icon.className = "bx bx-moon";
    }
  },
};

// ========== Initialization and Event Listeners ==========
document.addEventListener("DOMContentLoaded", function () {
  // Clock Events
  clockElements.playBtn.addEventListener("click", () => {
    clockState.isRunning
      ? clockFunctions.pauseTimer()
      : clockFunctions.startTimer();
  });

  clockElements.resetBtn.addEventListener("click", () => {
    clockFunctions.resetTimer();
  });

  clockElements.hoursInput.addEventListener("change", () => {
    clockState.time.hours = parseInt(clockElements.hoursInput.value) || 0;
    clockFunctions.updateDisplay();
  });

  clockElements.minutesInput.addEventListener("change", () => {
    clockState.time.minutes = parseInt(clockElements.minutesInput.value) || 0;
    clockFunctions.updateDisplay();
  });

  clockElements.secondsInput.addEventListener("change", () => {
    clockState.time.seconds = parseInt(clockElements.secondsInput.value) || 0;
    clockFunctions.updateDisplay();
  });

  // Todo List Events
  todoApp.elements.form.addEventListener("submit", (e) => todoApp.addTodo(e));

  // Theme Toggle Events
  themeManager.elements.toggle.addEventListener("click", () =>
    themeManager.toggleTheme()
  );

  // If you have a button to water the tree, add this listener
  const waterBtn = document.getElementById("water-btn");
  if (waterBtn) {
    waterBtn.addEventListener("click", () => {
      clockState.wateringSound.play();
    });
  }

  // Audio Library Events
  const searchInput = clockElements.audioSearchInput;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clockFunctions.updateAudioList(
        clockState.selectedReciter,
        e.target.value
      );
    });
  }

  const reciterSelect = clockElements.reciterSelect;
  if (reciterSelect) {
    reciterSelect.addEventListener("change", (e) => {
      clockState.selectedReciter = e.target.value;
      clockFunctions.updateAudioList(
        clockState.selectedReciter,
        searchInput.value
      );
    });
  }

  const volumeBar = clockElements.volumeBar;
  if (volumeBar) {
    volumeBar.addEventListener("input", (e) => {
      clockState.currentAudioPlayer.volume = e.target.value / 100;
    });
  }

  // Initial setup
  clockFunctions.updateDisplay();
  todoApp.renderTodos();
  themeManager.init();
  clockFunctions.updateAudioList(clockState.selectedReciter); // تحديث القائمة عند تحميل الصفحة
});

// ========== Additional Functions (Notifications, etc.) ==========
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    });
  }
}

function showTimerNotification() {
  if (Notification.permission === "granted") {
    const title = "انتهى وقت المذاكرة!";
    const options = {
      body: "الوقت اللي حددته خلص. حان وقت الراحة أو المهمة اللي بعدها.",
      icon: "https://cdn-icons-png.flaticon.com/512/3238/3238128.png",
    };
    new Notification(title, options);
  }
}

requestNotificationPermission();

const additionalCSS = `
  /* Add your additional CSS here if needed */
`;

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;

    fetch(this.action, {
      method: "POST",
      body: new FormData(this),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          showNotification(
            "تم إرسال الرسالة بنجاح! سنتواصل معك قريباً",
            "success"
          );
          this.reset();
        } else {
          throw new Error("فشل الإرسال");
        }
      })
      .catch((error) => {
        showNotification(
          "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى",
          "error"
        );
        console.error("Error:", error);
      })
      .finally(() => {
        submitBtn.innerHTML = "إرسال الرسالة";
        submitBtn.disabled = false;
      });
  });
}

function validateForm() {
  const form = document.getElementById("contactForm");
  let isValid = true;

  if (form.name.value.trim() === "") {
    showError(form.name, "الاسم مطلوب");
    isValid = false;
  } else {
    clearError(form.name);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email.value)) {
    showError(form.email, "بريد إلكتروني غير صحيح");
    isValid = false;
  } else {
    clearError(form.email);
  }

  ["subject", "message"].forEach((field) => {
    if (form[field].value.trim() === "") {
      showError(form[field], "هذا الحقل مطلوب");
      isValid = false;
    } else {
      clearError(form[field]);
    }
  });

  return isValid;
}

function showError(input, message) {
  const formGroup = input.closest(".form-group");
  const errorElement = formGroup.querySelector(".error-message");
  input.style.borderColor = "var(--danger-color)";
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(input) {
  const formGroup = input.closest(".form-group");
  const errorElement = formGroup.querySelector(".error-message");
  input.style.borderColor = "var(--border-color)";
  if (errorElement) {
    errorElement.textContent = "";
  }
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
    }"></i>
    ${message}
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// سور قرانبه
const surahTranslations = {
  الفاتحة: "Al-Fatiha",
  البقرة: "Al-Baqarah",
  "آل عمران": "Al-Imran",
  النساء: "An-Nisa",
  المائدة: "Al-Ma'idah",
  الأنعام: "Al-An'am",
  الأعراف: "Al-A'raf",
  الأنفال: "Al-Anfal",
  التوبة: "At-Tawbah",
  يونس: "Yunus",
  هود: "Hud",
  يوسف: "Yusuf",
  الرعد: "Ar-Ra'd",
  إبراهيم: "Ibrahim",
  الحجر: "Al-Hijr",
  النحل: "An-Nahl",
  الإسراء: "Al-Isra",
  الكهف: "Al-Kahf",
  مريم: "Maryam",
  طه: "Taha",
  الأنبياء: "Al-Anbiya",
  الحج: "Al-Hajj",
  المؤمنون: "Al-Mu'minun",
  النور: "An-Nur",
  الفرقان: "Al-Furqan",
  الشعراء: "Ash-Shu'ara",
  النمل: "An-Naml",
  القصص: "Al-Qasas",
  العنكبوت: "Al-Ankabut",
  الروم: "Ar-Rum",
  لقمان: "Luqman",
  السجدة: "As-Sajdah",
  الأحزاب: "Al-Ahzab",
  سبأ: "Saba",
  فاطر: "Fatir",
  يس: "Ya-Sin",
  الصافات: "As-Saffat",
  ص: "Sad",
  الزمر: "Az-Zumar",
  غافر: "Ghafir",
  فصلت: "Fussilat",
  الشورى: "Ash-Shura",
  الزخرف: "Az-Zukhruf",
  الدخان: "Ad-Dukhan",
  الجاثية: "Al-Jathiyah",
  الأحقاف: "Al-Ahqaf",
  محمد: "Muhammad",
  الفتح: "Al-Fath",
  الحجرات: "Al-Hujurat",
  ق: "Qaf",
  الذاريات: "Adh-Dhariyat",
  الطور: "At-Tur",
  النجم: "An-Najm",
  القمر: "Al-Qamar",
  الرحمن: "Ar-Rahman",
  الواقعة: "Al-Waqi'ah",
  الحديد: "Al-Hadid",
  المجادلة: "Al-Mujadila",
  الحشر: "Al-Hashr",
  الممتحنة: "Al-Mumtahanah",
  الصف: "As-Saff",
  الجمعة: "Al-Jumu'ah",
  المنافقون: "Al-Munafiqun",
  التغابن: "At-Taghabun",
  الطلاق: "At-Talaq",
  التحريم: "At-Tahrim",
  الملك: "Al-Mulk",
  القلم: "Al-Qalam",
  الحاقة: "Al-Haqqah",
  المعارج: "Al-Ma'arij",
  نوح: "Nuh",
  الجن: "Al-Jinn",
  المزمل: "Al-Muzzammil",
  المدثر: "Al-Muddaththir",
  القيامة: "Al-Qiyamah",
  الإنسان: "Al-Insan",
  المرسلات: "Al-Mursalat",
  النبأ: "An-Naba",
  النازعات: "An-Nazi'at",
  عبس: "Abasa",
  التكوير: "At-Takwir",
  الإنفطار: "Al-Infitar",
  المطففين: "Al-Mutaffifin",
  الإنشقاق: "Al-Inshiqaq",
  البروج: "Al-Buruj",
  الطارق: "At-Tariq",
  الأعلى: "Al-A'la",
  الغاشية: "Al-Ghashiyah",
  الفجر: "Al-Fajr",
  البلد: "Al-Balad",
  الشمس: "Ash-Shams",
  الليل: "Al-Layl",
  الضحى: "Ad-Duha",
  الشرح: "Al-Inshirah",
  التين: "At-Tin",
  العلق: "Al-Alaq",
  القدر: "Al-Qadr",
  البينة: "Al-Bayyinah",
  الزلزلة: "Az-Zalzalah",
  العاديات: "Al-Adiyat",
  القارعة: "Al-Qari'ah",
  التكاثر: "At-Takathur",
  العصر: "Al-Asr",
  الهمزة: "Al-Humazah",
  الفيل: "Al-Fil",
  قريش: "Quraysh",
  الماعون: "Al-Ma'un",
  الكوثر: "Al-Kawthar",
  الكافرون: "Al-Kafirun",
  النصر: "An-Nasr",
  المسد: "Al-Masad",
  الإخلاص: "Al-Ikhlas",
  الفلق: "Al-Falaq",
  الناس: "An-Nas",
};

// تشغيل و ايقاف الصوت
// ربط الأزرار بالوظائف
const playPauseBtn = document.getElementById("play-pause-btn");
const stopBtn = document.getElementById("stop-btn");

// لما تدوس على زرار Play
playPauseBtn.addEventListener("click", function () {
  if (clockState.currentAudioPlayer.paused) {
    clockState.currentAudioPlayer.play();
  } else {
    clockState.currentAudioPlayer.pause();
  }
});

// لما تدوس على زرار Stop
stopBtn.addEventListener("click", function () {
  clockState.currentAudioPlayer.pause();
  clockState.currentAudioPlayer.currentTime = 0;
});

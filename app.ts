// عناصر DOM
const clockElement = document.getElementById('clock') as HTMLElement;
const alarmTimeInput = document.getElementById('alarm-time') as HTMLInputElement;
const setAlarmBtn = document.getElementById('set-alarm') as HTMLButtonElement;
const stopAlarmBtn = document.getElementById('stop-alarm') as HTMLButtonElement;
const alarmMessage = document.getElementById('alarm-message') as HTMLElement;

// متغیرهای ساعت
let alarmTime: string | null = null;
let alarmInterval: number;

// به روزرسانی ساعت هر ثانیه
function updateClock(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    
    // بررسی هشدار
    checkAlarm(`${hours}:${minutes}`);
}

// بررسی فعال بودن هشدار
function checkAlarm(currentTime: string): void {
    if (alarmTime === currentTime) {
        triggerAlarm();
    }
}

// فعال کردن هشدار
function triggerAlarm(): void {
    alarmMessage.textContent =` ⏰ هشدار! ساعت ${alarmTime} رسیده است!`;
    alarmMessage.classList.add('active-alarm');
    
    // پخش صدای هشدار
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.loop = true;
    audio.play();
    
    // ذخیره رفرنس صدا برای توقف بعدی
    alarmInterval = setInterval(() => {
        audio.play();
    }, 1000);
}

// تنظیم هشدار
function setAlarm(): void {
    if (!alarmTimeInput.value) {
        alert('لطفاً زمان هشدار را انتخاب کنید');
        return;
    }
    
    alarmTime = alarmTimeInput.value;
    alarmMessage.textContent =` هشدار برای ساعت ${alarmTime} تنظیم شد`;
    alarmMessage.classList.remove('active-alarm');
    alarmMessage.style.display = 'block';
}

// توقف هشدار
function stopAlarm(): void {
    clearInterval(alarmInterval);
    alarmMessage.classList.remove('active-alarm');
    alarmMessage.textContent = '';
    alarmTime = null;
}

// رویدادهای کلیک
setAlarmBtn.addEventListener('click', setAlarm);
stopAlarmBtn.addEventListener('click', stopAlarm);

// شروع ساعت
updateClock();
setInterval(updateClock, 1000);
// FitTrack Static App - Complete JavaScript Implementation

class FitTrackApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.selectedDate = null;
        
        // Exercise data
        this.exercises = {
            strength: [
                'Bench Press', 'Squats', 'Deadlifts', 'Pull-ups', 'Push-ups',
                'Overhead Press', 'Barbell Rows', 'Bicep Curls', 'Tricep Dips',
                'Lat Pulldowns', 'Leg Press', 'Shoulder Press'
            ],
            cardio: [
                'Running', 'Cycling', 'Swimming', 'Rowing', 'Jumping Jacks',
                'Burpees', 'Treadmill', 'Elliptical', 'Stair Climber', 'Boxing'
            ],
            yoga: [
                'Sun Salutation', 'Warrior Pose', 'Downward Dog', 'Tree Pose',
                'Child\'s Pose', 'Mountain Pose', 'Triangle Pose', 'Cobra Pose'
            ],
            gripper: [
                'Grip Strength Training', 'Forearm Squeeze', 'Hand Gripper',
                'Wrist Curls', 'Finger Extensions', 'Plate Pinches'
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadWorkouts();
        this.updateStats();
        this.showPage('dashboard');
        this.updateCalendar();
        this.setDefaultDate();
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Navigation
        document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });
        
        // Workout form
        document.getElementById('workout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitWorkout();
        });
        
        // Workout type change
        document.getElementById('workout-type').addEventListener('change', (e) => {
            this.updateExerciseOptions(e.target.value);
            this.toggleFormFields(e.target.value);
        });
        
        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.previousMonth();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            this.nextMonth();
        });
        
        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.hideModal();
        });
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('fittrack-theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }
    
    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('fittrack-theme', isDark ? 'dark' : 'light');
    }
    
    showPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
        
        // Show page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');
        
        this.currentPage = pageId;
        
        // Page-specific updates
        if (pageId === 'dashboard') {
            this.updateStats();
            this.updateRecentWorkouts();
            this.updateProgressChart();
        } else if (pageId === 'progress') {
            this.updateProgressPage();
        } else if (pageId === 'calendar') {
            this.updateCalendar();
        }
    }
    
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workout-date').value = today;
    }
    
    updateExerciseOptions(workoutType) {
        const exerciseSelect = document.getElementById('exercise-name');
        exerciseSelect.innerHTML = '<option value="">Select exercise...</option>';
        
        if (workoutType && this.exercises[workoutType]) {
            this.exercises[workoutType].forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise;
                option.textContent = exercise;
                exerciseSelect.appendChild(option);
            });
        }
    }
    
    toggleFormFields(workoutType) {
        const strengthFields = document.getElementById('strength-fields');
        const cardioFields = document.getElementById('cardio-fields');
        
        strengthFields.classList.add('hidden');
        cardioFields.classList.add('hidden');
        
        if (workoutType === 'strength' || workoutType === 'gripper') {
            strengthFields.classList.remove('hidden');
        } else if (workoutType === 'cardio') {
            cardioFields.classList.remove('hidden');
        }
    }
    
    submitWorkout() {
        const formData = {
            date: document.getElementById('workout-date').value,
            type: document.getElementById('workout-type').value,
            exercise: document.getElementById('exercise-name').value,
            sets: document.getElementById('sets').value || null,
            reps: document.getElementById('reps').value || null,
            weight: document.getElementById('weight').value || null,
            duration: document.getElementById('duration').value || null,
            notes: document.getElementById('notes').value || ''
        };
        
        // Validate required fields
        if (!formData.date || !formData.type || !formData.exercise) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Save workout
        this.saveWorkout(formData);
        
        // Reset form
        document.getElementById('workout-form').reset();
        this.setDefaultDate();
        this.toggleFormFields('');
        this.updateExerciseOptions('');
        
        // Show success modal
        this.showModal();
        
        // Update stats if on dashboard
        if (this.currentPage === 'dashboard') {
            this.updateStats();
            this.updateRecentWorkouts();
        }
    }
    
    saveWorkout(workout) {
        const workouts = this.getWorkouts();
        workout.id = Date.now();
        workout.createdAt = new Date().toISOString();
        workouts.push(workout);
        localStorage.setItem('fittrack-workouts', JSON.stringify(workouts));
    }
    
    getWorkouts() {
        const workouts = localStorage.getItem('fittrack-workouts');
        return workouts ? JSON.parse(workouts) : [];
    }
    
    loadWorkouts() {
        return this.getWorkouts();
    }
    
    updateStats() {
        const workouts = this.getWorkouts();
        
        // Total workouts
        const totalWorkouts = workouts.length;
        document.getElementById('total-workouts').textContent = totalWorkouts;
        
        // Hours trained
        const totalMinutes = workouts.reduce((sum, workout) => {
            return sum + (parseInt(workout.duration) || 0);
        }, 0);
        const hoursTrained = (totalMinutes / 60).toFixed(1);
        document.getElementById('hours-trained').textContent = hoursTrained;
        
        // Weight lifted
        const weightLifted = workouts.reduce((sum, workout) => {
            if (workout.weight && workout.sets && workout.reps) {
                return sum + (parseFloat(workout.weight) * parseInt(workout.sets) * parseInt(workout.reps));
            }
            return sum;
        }, 0);
        document.getElementById('weight-lifted').textContent = `${Math.round(weightLifted)} lbs`;
        
        // Current streak
        const streak = this.calculateStreak(workouts);
        document.getElementById('current-streak').textContent = `${streak} days`;
    }
    
    calculateStreak(workouts) {
        if (workouts.length === 0) return 0;
        
        const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
        const workoutDates = new Set(sortedWorkouts.map(w => w.date));
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateString = checkDate.toISOString().split('T')[0];
            
            if (workoutDates.has(dateString)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        
        return streak;
    }
    
    updateRecentWorkouts() {
        const workouts = this.getWorkouts();
        const recentWorkouts = workouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        const container = document.getElementById('recent-workouts-list');
        container.innerHTML = '';
        
        if (recentWorkouts.length === 0) {
            container.innerHTML = '<p class="text-muted-foreground">No workouts logged yet. Start by logging your first workout!</p>';
            return;
        }
        
        recentWorkouts.forEach(workout => {
            const workoutElement = document.createElement('div');
            workoutElement.className = 'workout-item';
            
            const details = this.formatWorkoutDetails(workout);
            
            workoutElement.innerHTML = `
                <div class="workout-header">
                    <div class="workout-title">${workout.exercise}</div>
                    <div class="workout-date">${this.formatDate(workout.date)}</div>
                </div>
                <div class="workout-details">${details}</div>
                ${workout.notes ? `<div class="workout-notes">${workout.notes}</div>` : ''}
            `;
            
            container.appendChild(workoutElement);
        });
    }
    
    formatWorkoutDetails(workout) {
        if (workout.type === 'cardio') {
            return `${workout.duration} minutes`;
        } else if (workout.type === 'strength' || workout.type === 'gripper') {
            const parts = [];
            if (workout.sets) parts.push(`${workout.sets} sets`);
            if (workout.reps) parts.push(`${workout.reps} reps`);
            if (workout.weight) parts.push(`${workout.weight} lbs`);
            return parts.join(' • ');
        } else {
            return workout.type.charAt(0).toUpperCase() + workout.type.slice(1);
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    updateProgressChart() {
        const canvas = document.getElementById('progress-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const workouts = this.getWorkouts();
        if (workouts.length === 0) {
            ctx.fillStyle = 'hsl(var(--muted-foreground))';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No workout data yet', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Get last 7 days
        const last7Days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }
        
        // Count workouts per day
        const workoutCounts = last7Days.map(date => {
            return workouts.filter(w => w.date === date).length;
        });
        
        // Draw chart
        const maxCount = Math.max(...workoutCounts, 1);
        const barWidth = canvas.width / 7;
        const maxBarHeight = canvas.height - 40;
        
        ctx.fillStyle = 'hsl(var(--primary))';
        workoutCounts.forEach((count, index) => {
            const barHeight = (count / maxCount) * maxBarHeight;
            const x = index * barWidth + 10;
            const y = canvas.height - barHeight - 20;
            
            ctx.fillRect(x, y, barWidth - 20, barHeight);
            
            // Draw day labels
            ctx.fillStyle = 'hsl(var(--muted-foreground))';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            const dayLabel = new Date(last7Days[index]).toLocaleDateString('en-US', { weekday: 'short' });
            ctx.fillText(dayLabel, x + (barWidth - 20) / 2, canvas.height - 5);
            
            ctx.fillStyle = 'hsl(var(--primary))';
        });
    }
    
    updateProgressPage() {
        const workouts = this.getWorkouts();
        
        // Personal Records
        const recordsContainer = document.getElementById('personal-records');
        recordsContainer.innerHTML = '';
        
        if (workouts.length === 0) {
            recordsContainer.innerHTML = '<p class="text-muted-foreground">No workouts logged yet.</p>';
        } else {
            const records = this.calculatePersonalRecords(workouts);
            records.forEach(record => {
                const recordElement = document.createElement('div');
                recordElement.className = 'record-item';
                recordElement.innerHTML = `
                    <span>${record.exercise}</span>
                    <span class="font-semibold">${record.value}</span>
                `;
                recordsContainer.appendChild(recordElement);
            });
        }
        
        // Weekly Summary
        const summaryContainer = document.getElementById('weekly-summary');
        const weeklyStats = this.calculateWeeklyStats(workouts);
        
        summaryContainer.innerHTML = `
            <div class="summary-item">
                <div class="summary-value">${weeklyStats.workouts}</div>
                <div class="summary-label">Workouts</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${weeklyStats.hours}</div>
                <div class="summary-label">Hours</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${weeklyStats.weight}</div>
                <div class="summary-label">Weight (lbs)</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${weeklyStats.exercises}</div>
                <div class="summary-label">Exercises</div>
            </div>
        `;
        
        // Update detailed chart
        this.updateDetailedChart();
    }
    
    calculatePersonalRecords(workouts) {
        const records = new Map();
        
        workouts.forEach(workout => {
            if (workout.weight && workout.sets && workout.reps) {
                const totalWeight = parseFloat(workout.weight) * parseInt(workout.sets) * parseInt(workout.reps);
                const existing = records.get(workout.exercise);
                
                if (!existing || totalWeight > existing.total) {
                    records.set(workout.exercise, {
                        exercise: workout.exercise,
                        value: `${workout.weight} lbs × ${workout.sets}×${workout.reps}`,
                        total: totalWeight
                    });
                }
            }
        });
        
        return Array.from(records.values()).slice(0, 5);
    }
    
    calculateWeeklyStats(workouts) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);
        
        const totalHours = weeklyWorkouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0) / 60;
        const totalWeight = weeklyWorkouts.reduce((sum, w) => {
            if (w.weight && w.sets && w.reps) {
                return sum + (parseFloat(w.weight) * parseInt(w.sets) * parseInt(w.reps));
            }
            return sum;
        }, 0);
        const uniqueExercises = new Set(weeklyWorkouts.map(w => w.exercise)).size;
        
        return {
            workouts: weeklyWorkouts.length,
            hours: totalHours.toFixed(1),
            weight: Math.round(totalWeight),
            exercises: uniqueExercises
        };
    }
    
    updateDetailedChart() {
        const canvas = document.getElementById('detailed-progress-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const workouts = this.getWorkouts();
        if (workouts.length === 0) {
            ctx.fillStyle = 'hsl(var(--muted-foreground))';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('No workout data yet', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Get last 30 days
        const last30Days = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            last30Days.push(date.toISOString().split('T')[0]);
        }
        
        // Count workouts per day
        const workoutCounts = last30Days.map(date => {
            return workouts.filter(w => w.date === date).length;
        });
        
        // Draw line chart
        const maxCount = Math.max(...workoutCounts, 1);
        const stepX = canvas.width / (last30Days.length - 1);
        const maxY = canvas.height - 40;
        
        ctx.strokeStyle = 'hsl(var(--primary))';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        workoutCounts.forEach((count, index) => {
            const x = index * stepX;
            const y = maxY - (count / maxCount) * (maxY - 20);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw points
            ctx.fillStyle = 'hsl(var(--primary))';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        ctx.stroke();
    }
    
    updateCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        document.getElementById('current-month').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const calendar = document.getElementById('calendar-grid');
        calendar.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            header.style.cssText = `
                background: hsl(var(--muted));
                color: hsl(var(--muted-foreground));
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5rem;
                font-size: 0.875rem;
            `;
            calendar.appendChild(header);
        });
        
        const workouts = this.getWorkouts();
        const workoutDates = new Set(workouts.map(w => w.date));
        
        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();
            
            const dateString = currentDate.toISOString().split('T')[0];
            
            if (currentDate.getMonth() !== this.currentMonth) {
                dayElement.classList.add('other-month');
            }
            
            if (workoutDates.has(dateString)) {
                dayElement.classList.add('has-workout');
                const indicator = document.createElement('div');
                indicator.className = 'workout-indicator';
                dayElement.appendChild(indicator);
            }
            
            dayElement.addEventListener('click', () => {
                this.selectDate(dateString, dayElement);
            });
            
            calendar.appendChild(dayElement);
        }
    }
    
    selectDate(dateString, dayElement) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked day
        dayElement.classList.add('selected');
        this.selectedDate = dateString;
        
        // Show day details
        this.showDayDetails(dateString);
    }
    
    showDayDetails(dateString) {
        const workouts = this.getWorkouts().filter(w => w.date === dateString);
        const detailsContainer = document.getElementById('day-details');
        const dateElement = document.getElementById('selected-date');
        const workoutsContainer = document.getElementById('day-workouts');
        
        dateElement.textContent = this.formatDate(dateString);
        
        if (workouts.length === 0) {
            workoutsContainer.innerHTML = '<p class="text-muted-foreground">No workouts on this day.</p>';
        } else {
            workoutsContainer.innerHTML = '';
            workouts.forEach(workout => {
                const workoutElement = document.createElement('div');
                workoutElement.className = 'workout-item';
                workoutElement.innerHTML = `
                    <div class="workout-title">${workout.exercise}</div>
                    <div class="workout-details">${this.formatWorkoutDetails(workout)}</div>
                    ${workout.notes ? `<div class="workout-notes">${workout.notes}</div>` : ''}
                `;
                workoutsContainer.appendChild(workoutElement);
            });
        }
        
        detailsContainer.classList.remove('hidden');
    }
    
    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.updateCalendar();
    }
    
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.updateCalendar();
    }
    
    showModal() {
        document.getElementById('success-modal').classList.remove('hidden');
    }
    
    hideModal() {
        document.getElementById('success-modal').classList.add('hidden');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FitTrackApp();
});

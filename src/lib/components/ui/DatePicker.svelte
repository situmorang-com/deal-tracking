<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ChevronLeft, ChevronRight, Calendar } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';

  let { value = $bindable(''), placeholder = 'Select date', disabled = false } = $props();

  const dispatch = createEventDispatcher();

  let showCalendar = $state(false);
  let currentMonth = $state(new Date());
  let selectedDate = $state(value ? new Date(value) : null);

  $effect(() => {
    if (value) {
      selectedDate = new Date(value);
      currentMonth = new Date(value);
    }
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  function toggleCalendar() {
    if (!disabled) {
      showCalendar = !showCalendar;
    }
  }

  function closeCalendar() {
    showCalendar = false;
  }

  function previousMonth() {
    console.log('previousMonth called');
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }

  function nextMonth() {
    console.log('nextMonth called');
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  }

  function selectDate(date: Date) {
    console.log('selectDate called with:', date);
    selectedDate = date;
    // Format date as YYYY-MM-DD in local timezone to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoString = `${year}-${month}-${day}`;
    value = isoString;
    dispatch('change', isoString);
    closeCalendar();
  }

  function getCalendarDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDateStr = selectedDate ? selectedDate.toDateString() : null;

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toDateString();
      days.push({
        date,
        dateString: dateStr,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isSelected: selectedDateStr === dateStr
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toDateString();
      days.push({
        date,
        dateString: dateStr,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isSelected: selectedDateStr === dateStr
      });
    }

    // Next month days to fill the calendar
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toDateString();
      days.push({
        date,
        dateString: dateStr,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isSelected: selectedDateStr === dateStr
      });
    }

    return days;
  }

  function formatDisplayDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (showCalendar && target && !target.closest('.date-picker-container')) {
      closeCalendar();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showCalendar) {
      event.stopImmediatePropagation();
      event.preventDefault();
      closeCalendar();
    }
  }

  function changeMonth(event: any) {
    const monthIndex = parseInt(event.target.value);
    console.log('changeMonth called, new month:', monthIndex);
    currentMonth = new Date(currentMonth.getFullYear(), monthIndex, 1);
    console.log('currentMonth updated to:', currentMonth);
  }

  function changeYear(event: any) {
    const year = parseInt(event.target.value);
    console.log('changeYear called, new year:', year);
    currentMonth = new Date(year, currentMonth.getMonth(), 1);
    console.log('currentMonth updated to:', currentMonth);
  }

  function getYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 50; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  }

  // Make calendar days reactive to currentMonth and selectedDate changes
  let calendarDays = $derived(getCalendarDays());
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="date-picker-container relative">
  <div class="relative cursor-pointer" onclick={toggleCalendar} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && toggleCalendar()}>
    <Input
      value={formatDisplayDate(value)}
      {placeholder}
      readonly
      {disabled}
      class="pr-10 cursor-pointer"
    />
    <div class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center pointer-events-none">
      <Calendar class="w-4 h-4 text-white/40" />
    </div>
  </div></div>

{#if showCalendar}
  <div class="fixed inset-0 z-[100] bg-black/50" onclick={closeCalendar} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && closeCalendar()}>
    <div class="absolute bg-black/70 border border-white/40 rounded-2xl shadow-2xl p-5 w-80" style="top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);"
         onclick={(e) => e.stopPropagation()} role="dialog" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && closeCalendar()}>
      <!-- Dark overlay for better text contrast -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/40 to-gray-900/60 rounded-2xl pointer-events-none"></div>
      <!-- Additional glassmorphism layer -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none"></div>
      <div class="relative z-10">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="h-7 w-7 p-0 hover:bg-white/20 text-white rounded-md transition-colors"
          onclick={(e) => { e.preventDefault(); e.stopPropagation(); previousMonth(); }}
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <div class="flex items-center gap-2">
          <select
            class="bg-black/50 text-white text-sm font-bold border border-white/60 rounded-lg px-3 py-2 hover:bg-black/70 focus:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg"
            value={currentMonth.getMonth()}
            onchange={changeMonth}
          >
            {#each months as month, index}
              <option value={index} class="bg-gray-900 text-white font-medium">{month}</option>
            {/each}
          </select>

          <select
            class="bg-black/50 text-white text-sm font-bold border border-white/60 rounded-lg px-3 py-2 hover:bg-black/70 focus:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg"
            value={currentMonth.getFullYear()}
            onchange={changeYear}
          >
            {#each getYearOptions() as year}
              <option value={year} class="bg-gray-900 text-white font-medium">{year}</option>
            {/each}
          </select>
        </div>

        <button
          type="button"
          class="h-7 w-7 p-0 hover:bg-white/20 text-white rounded-md transition-colors"
          onclick={(e) => { e.preventDefault(); e.stopPropagation(); nextMonth(); }}
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Days of Week Header -->
      <div class="grid grid-cols-7 mb-3">
        {#each daysOfWeek as day, index}
          <div class="text-xs font-bold text-center py-2 {index === 0 || index === 6 ? 'text-red-300' : 'text-white/90'}">
            {day}
          </div>
        {/each}
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1">
        {#each calendarDays as day}
          <button
            type="button"
            class="h-10 w-full text-sm rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors duration-150 font-bold
              {day.isCurrentMonth ? (day.isWeekend ? 'text-red-300 drop-shadow-lg' : 'text-white drop-shadow-lg') : (day.isWeekend ? 'text-red-400/50' : 'text-white/70')}
              {day.isToday && !day.isSelected ? 'bg-blue-500/40 text-white font-bold border border-blue-400/60 shadow-lg ring-1 ring-blue-400/40' : ''}
              {day.isSelected && !day.isToday ? 'bg-gradient-to-br from-orange-500/90 to-orange-600/90 text-white hover:from-orange-600/90 hover:to-orange-700/90 border-2 border-orange-300/80 shadow-xl ring-2 ring-orange-400/30' : ''}
              {day.isToday && day.isSelected ? 'bg-gradient-to-br from-purple-600/90 to-purple-700/90 text-white hover:from-purple-700/90 hover:to-purple-800/90 border-2 border-purple-300/80 shadow-xl ring-2 ring-purple-400/40' : ''}"
            onclick={() => selectDate(day.date)}
          >
            {day.date.getDate()}
          </button>
        {/each}
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/30">
        <button
          type="button"
          class="text-sm h-10 px-2 text-white bg-blue-500/40 hover:bg-blue-500/60 font-bold border border-blue-400/60 hover:border-blue-400/80 rounded-xl hover:shadow-lg transition-all duration-200 drop-shadow-lg hover:scale-105 ring-1 ring-blue-400/40"
          onclick={(e) => { e.preventDefault(); selectDate(new Date()); }}
        >
          Today
        </button>
        <button
          type="button"
          class="text-sm h-10 px-2 text-white bg-black/30 hover:bg-black/50 font-bold border border-white/40 hover:border-white/60 rounded-xl hover:shadow-lg transition-all duration-200 drop-shadow-lg hover:scale-105"
          onclick={(e) => {
            e.preventDefault();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            selectDate(tomorrow);
          }}
        >
          1d
        </button>
        <button
          type="button"
          class="text-sm h-10 px-2 text-white bg-black/30 hover:bg-black/50 font-bold border border-white/40 hover:border-white/60 rounded-xl hover:shadow-lg transition-all duration-200 drop-shadow-lg hover:scale-105"
          onclick={(e) => {
            e.preventDefault();
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            selectDate(nextWeek);
          }}
        >
          1w
        </button>
        <button
          type="button"
          class="text-sm h-10 px-2 text-white bg-black/30 hover:bg-black/50 font-bold border border-white/40 hover:border-white/60 rounded-xl hover:shadow-lg transition-all duration-200 drop-shadow-lg hover:scale-105"
          onclick={(e) => {
            e.preventDefault();
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            selectDate(nextMonth);
          }}
        >
          1mo
        </button>
      </div>
      </div>
    </div>
  </div>
{/if}
<script>
  import { onMount } from 'svelte';
  import {
    TrendingUp, DollarSign, Calendar, Users, Building, Target,
    Eye, Clock, CheckCircle, AlertCircle, User, MessageSquare, Plus, Edit
  } from 'lucide-svelte';
  import PipelineOpportunityForm from '$lib/components/PipelineOpportunityForm.svelte';

  // Form state
  let showPipelineForm = false;
  let editingOpportunity = null;

  // Data from database
  let opportunities = [];

  let stats = {
    totalValue: 0,
    weightedValue: 0,
    totalOpportunities: 0,
    avgDealSize: 0,
    closingThisMonth: 0
  };

  function getStageColor(stage) {
    const colors = {
      'Discovery': 'from-blue-500 to-blue-600',
      'Qualification': 'from-yellow-500 to-yellow-600',
      'Proposal': 'from-orange-500 to-orange-600',
      'Negotiation': 'from-green-500 to-green-600',
      'Closed Won': 'from-emerald-500 to-emerald-600',
      'Closed Lost': 'from-red-500 to-red-600'
    };
    return colors[stage] || 'from-gray-500 to-gray-600';
  }

  function formatCurrency(amount) {
    return 'Rp ' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    }).format(amount);
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  let currentTime = new Date();

  // Update time every minute
  setInterval(() => {
    currentTime = new Date();
  }, 60000);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Load opportunities from API
  onMount(async () => {
    await fetchOpportunities();
  });

  async function fetchOpportunities() {
    try {
      const response = await fetch('/api/opportunities');
      if (response.ok) {
        opportunities = await response.json();
        updateStats();
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  }

  async function handleSaveOpportunity(event) {
    const newOpportunity = event.detail;
    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOpportunity)
      });

      if (response.ok) {
        await fetchOpportunities();
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  }

  async function handleUpdateOpportunity(event) {
    const updatedOpportunity = event.detail;
    try {
      const response = await fetch('/api/opportunities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOpportunity)
      });

      if (response.ok) {
        await fetchOpportunities();
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
    }
  }

  async function handleDeleteOpportunity(event) {
    const id = event.detail;
    try {
      const response = await fetch('/api/opportunities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        await fetchOpportunities();
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  }

  function handleEditOpportunity(opportunity) {
    editingOpportunity = opportunity;
    showPipelineForm = true;
  }

  function updateStats() {
    if (!opportunities || !Array.isArray(opportunities) || opportunities.length === 0) {
      stats = {
        totalValue: 0,
        weightedValue: 0,
        totalOpportunities: 0,
        avgDealSize: 0,
        closingThisMonth: 0
      };
      return;
    }

    stats.totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
    stats.weightedValue = opportunities.reduce((sum, opp) => sum + ((opp.value || 0) * (opp.probability || 0) / 100), 0);
    stats.totalOpportunities = opportunities.length;
    stats.avgDealSize = stats.totalValue / opportunities.length;
    stats.closingThisMonth = opportunities.filter(opp => {
      if (!opp.expectedCloseDate) return false;
      const closeDate = new Date(opp.expectedCloseDate);
      const now = new Date();
      return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear();
    }).length;
  }
</script>

<svelte:head>
  <title>EdPipelines - Personal CRM</title>
</svelte:head>


<div class="min-h-screen px-3 md:px-4 py-4 md:py-8">
  <div class="container mx-auto max-w-7xl">
    <!-- Enhanced Header -->
    <div class="mb-6 md:mb-12 p-4 md:p-8 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center space-x-3 md:space-x-4">
          <img
            src="/edmund-situmorang-profilepic.png"
            alt="Edmund Situmorang"
            class="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover border-2 border-white/20"
          />
          <div>
            <h1 class="text-2xl md:text-4xl font-bold text-white tracking-tight">EdPipelines</h1>
            <p class="text-white/70 text-sm md:text-lg">{getGreeting()}! Track your sales pipeline.</p>
          </div>
        </div>
        <div class="text-left md:text-right w-full md:w-auto">
          <div class="text-xl md:text-3xl font-bold text-white tabular-nums">{formatTime(currentTime)}</div>
          <div class="text-xs md:text-sm text-white/60">{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
      <div class="bg-white/10 backdrop-blur-lg p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs md:text-sm font-semibold text-white/80">Pipeline Value</h3>
            <DollarSign class="w-4 h-4 md:w-6 md:h-6 text-green-400/60" />
          </div>
          <p class="text-lg md:text-2xl font-bold text-green-400">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs md:text-sm font-semibold text-white/80">Weighted Value</h3>
            <Target class="w-4 h-4 md:w-6 md:h-6 text-blue-400/60" />
          </div>
          <p class="text-lg md:text-2xl font-bold text-blue-400">{formatCurrency(stats.weightedValue)}</p>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs md:text-sm font-semibold text-white/80">Active Deals</h3>
            <Eye class="w-4 h-4 md:w-6 md:h-6 text-purple-400/60" />
          </div>
          <p class="text-lg md:text-2xl font-bold text-purple-400">{stats.totalOpportunities}</p>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs md:text-sm font-semibold text-white/80">Avg Deal Size</h3>
            <TrendingUp class="w-4 h-4 md:w-6 md:h-6 text-yellow-400/60" />
          </div>
          <p class="text-lg md:text-2xl font-bold text-yellow-400">{formatCurrency(stats.avgDealSize)}</p>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 col-span-2 md:col-span-1">
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs md:text-sm font-semibold text-white/80">Closing This Month</h3>
            <Calendar class="w-4 h-4 md:w-6 md:h-6 text-red-400/60" />
          </div>
          <p class="text-lg md:text-2xl font-bold text-red-400">{stats.closingThisMonth}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
      <!-- Opportunities List -->
      <div class="xl:col-span-2">
        <div class="bg-white/10 backdrop-blur-lg p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/20">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div class="flex items-center space-x-2 md:space-x-3">
              <div class="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/20 backdrop-blur-sm">
                <TrendingUp class="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 class="text-lg md:text-2xl font-bold text-white">Active Opportunities</h2>
            </div>
            <button
              on:click={() => {
                editingOpportunity = null;
                showPipelineForm = true;
              }}
              class="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-sm md:text-base font-semibold rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus class="w-4 h-4 md:w-5 md:h-5" />
              <span>Add New</span>
            </button>
          </div>

          <div class="space-y-4">
            {#each opportunities as opportunity}
              <div class="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <!-- Stage indicator -->
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b {getStageColor(opportunity.stage)}"></div>

                <div class="p-4 md:p-6 pl-5 md:pl-8">
                  <!-- Header -->
                  <div class="flex items-start justify-between mb-3 md:mb-4 gap-2">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-white font-semibold text-base md:text-lg group-hover:text-white/90 transition-colors truncate">
                        {opportunity.title}
                      </h3>
                      <div class="flex items-center space-x-1 md:space-x-2 mt-1">
                        <Building class="w-3 h-3 md:w-4 md:h-4 text-white/60 flex-shrink-0" />
                        <span class="text-white/70 text-xs md:text-sm truncate">{opportunity.company}</span>
                      </div>
                    </div>

                    <div class="flex items-start space-x-2 md:space-x-3 flex-shrink-0">
                      <div class="text-right">
                        <div class="text-lg md:text-2xl font-bold text-green-400">
                          {formatCurrency(opportunity.value)}
                        </div>
                        <div class="text-white/60 text-xs md:text-sm whitespace-nowrap">
                          {opportunity.probability}%
                        </div>
                      </div>

                      <!-- Edit Button -->
                      <button
                        on:click={() => handleEditOpportunity(opportunity)}
                        class="md:opacity-0 md:group-hover:opacity-100 p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all duration-300"
                        title="Edit opportunity"
                      >
                        <Edit class="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Contact Info -->
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {opportunity.contactName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p class="text-white font-medium text-sm">{opportunity.contactName}</p>
                      <p class="text-white/60 text-xs">{opportunity.contactTitle}</p>
                    </div>
                  </div>

                  <!-- Description -->
                  {#if opportunity.description}
                    <div class="mb-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <p class="text-white/80 text-sm leading-relaxed">{opportunity.description}</p>
                    </div>
                  {/if}

                  <!-- Footer -->
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div class="flex items-center gap-2 md:gap-4 flex-wrap">
                      <!-- Stage badge -->
                      <div class="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-gradient-to-r {getStageColor(opportunity.stage)} text-white text-xs font-medium">
                        {opportunity.stage}
                      </div>

                      <!-- Days in stage -->
                      <div class="flex items-center space-x-1">
                        <Clock class="w-3 h-3 text-white/60" />
                        <span class="text-white/60 text-xs">{opportunity.daysInStage}d</span>
                      </div>
                    </div>

                    <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs text-white/60">
                      <div class="flex items-center space-x-1">
                        <MessageSquare class="w-3 h-3" />
                        <span class="truncate">Last: {formatTimeAgo(opportunity.lastActivity)}</span>
                      </div>

                      <div class="flex items-center space-x-1">
                        <Calendar class="w-3 h-3" />
                        <span>Close: {new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Stage Distribution -->
        <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Target class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white">Pipeline Stages</h3>
          </div>

          <div class="space-y-3">
            {#each ['Discovery', 'Qualification', 'Proposal', 'Negotiation'] as stage}
              {@const stageOpps = (opportunities || []).filter(o => o.stage === stage)}
              {@const stageValue = stageOpps.reduce((sum, o) => sum + (o.value || 0), 0)}
              <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-white font-medium text-sm">{stage}</span>
                  <span class="text-white/80 text-sm font-semibold">{stageOpps.length}</span>
                </div>
                {#if stageValue > 0}
                  <div class="text-white/60 text-xs">{formatCurrency(stageValue)}</div>
                {/if}
                <div class="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div class="bg-gradient-to-r {getStageColor(stage)} h-2 rounded-full transition-all duration-300"
                       style="width: {opportunities.length > 0 ? (stageOpps.length / opportunities.length) * 100 : 0}%"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Clock class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white">Recent Activity</h3>
          </div>

          <div class="space-y-3">
            {#each opportunities.slice(0, 3) as opp}
              <div class="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span class="text-white text-sm font-medium">{opp.title}</span>
                </div>
                <p class="text-white/60 text-xs ml-4">Last activity: {formatTimeAgo(opp.lastActivity)}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Pipeline Opportunity Form -->
<PipelineOpportunityForm
  bind:show={showPipelineForm}
  bind:editingOpportunity={editingOpportunity}
  on:save={handleSaveOpportunity}
  on:update={handleUpdateOpportunity}
  on:delete={handleDeleteOpportunity}
/>

<style>
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
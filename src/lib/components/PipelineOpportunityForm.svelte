<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    X, User, Building, Target, DollarSign,
    MessageSquare, Briefcase, Plus, Search, TrendingUp,
    Eye, FileText, Handshake, CheckCircle, Trash2
  } from 'lucide-svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Label from '$lib/components/ui/Label.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import DatePicker from '$lib/components/ui/DatePicker.svelte';
  import { generateId } from '$lib/utils';

  export let show = false;
  export let editingOpportunity = null;

  // Contact management
  let contacts = [];
  let selectedContactId = '';
  let showNewContactForm = false;
  let contactSearchQuery = '';
  let showContactDropdown = false;
  let newContactData = {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: ''
  };

  const dispatch = createEventDispatcher();

  // Form data
  let formData = {
    title: '',
    company: '',
    value: '',
    stage: 'Discovery',
    probability: 50,
    contactName: '',
    contactTitle: '',
    contactId: '',
    expectedCloseDate: '',
    description: ''
  };

  // Display value for formatted input
  let displayValue = '';

  let errors = {};

  const stages = [
    { value: 'Discovery', icon: Eye, color: 'from-blue-500 to-blue-600' },
    { value: 'Qualification', icon: Target, color: 'from-yellow-500 to-yellow-600' },
    { value: 'Proposal', icon: FileText, color: 'from-orange-500 to-orange-600' },
    { value: 'Negotiation', icon: Handshake, color: 'from-green-500 to-green-600' }
  ];

  function validateForm() {
    errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.company.trim()) {
      errors.company = 'Company is required';
      isValid = false;
    }

    if (!formData.value || formData.value <= 0) {
      errors.value = 'Valid deal value is required';
      isValid = false;
    }

    if (!formData.stage) {
      errors.stage = 'Stage is required';
      isValid = false;
    }

    if (!formData.contactId && !formData.contactName.trim()) {
      errors.contact = 'Please select a contact or create a new one';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.expectedCloseDate) {
      errors.expectedCloseDate = 'Expected close date is required';
      isValid = false;
    }

    return isValid;
  }

  function handleSubmit() {
    if (!validateForm()) return;

    const opportunityData = {
      ...formData,
      value: parseFloat(formData.value),
      lastActivity: new Date().toISOString().split('T')[0]
    };

    if (editingOpportunity) {
      // Update existing opportunity
      const updatedOpportunity = {
        ...editingOpportunity,
        ...opportunityData
      };
      dispatch('update', updatedOpportunity);
    } else {
      // Create new opportunity
      const newOpportunity = {
        id: generateId(),
        ...opportunityData,
        daysInStage: 0
      };
      dispatch('save', newOpportunity);
    }

    handleClose();
  }

  function handleClose() {
    show = false;
    editingOpportunity = null;
    formData = {
      title: '',
      company: '',
      value: '',
      stage: 'Discovery',
      probability: 50,
      contactName: '',
      contactTitle: '',
      contactId: '',
      expectedCloseDate: '',
      description: ''
    };
    displayValue = '';
    selectedContactId = '';
    contactSearchQuery = '';
    showContactDropdown = false;
    showNewContactForm = false;
    newContactData = {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: ''
    };
    errors = {};
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && show) {
      // Check if any calendar/dropdown is open before closing the form
      const isCalendarOpen = document.querySelector('.fixed.inset-0.z-\\[100\\]');
      if (!isCalendarOpen) {
        handleClose();
      }
    }
  }

  function handleDelete() {
    if (editingOpportunity && confirm('Are you sure you want to delete this opportunity?')) {
      dispatch('delete', editingOpportunity.id);
      handleClose();
    }
  }

  // Contact functions
  onMount(async () => {
    await fetchContacts();
  });

  // Populate form when editing
  $: if (editingOpportunity && show) {
    formData = {
      title: editingOpportunity.title || '',
      company: editingOpportunity.company || '',
      value: editingOpportunity.value ? editingOpportunity.value.toString() : '',
      stage: editingOpportunity.stage || 'Discovery',
      probability: editingOpportunity.probability || 50,
      contactName: editingOpportunity.contactName || '',
      contactTitle: editingOpportunity.contactTitle || '',
      contactId: editingOpportunity.contactId || '',
      expectedCloseDate: editingOpportunity.expectedCloseDate || '',
      description: editingOpportunity.description || ''
    };
    selectedContactId = editingOpportunity.contactId || '';
    contactSearchQuery = editingOpportunity.contactName || '';

    // Format the display value for editing
    if (editingOpportunity.value) {
      displayValue = formatNumber(editingOpportunity.value.toString());
    } else {
      displayValue = '';
    }
  }

  async function fetchContacts() {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        contacts = await response.json();
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }

  function selectContact(contact) {
    selectedContactId = contact.id;
    formData.contactId = contact.id;
    formData.contactName = contact.fullName;
    formData.contactTitle = contact.jobTitle || '';
    if (!formData.company) {
      formData.company = contact.company || '';
    }
    contactSearchQuery = contact.fullName;
    showContactDropdown = false;
  }

  async function handleCreateContact() {
    if (!newContactData.fullName.trim()) {
      return;
    }

    try {
      const contactResponse = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: generateId(),
          fullName: newContactData.fullName,
          email: newContactData.email || null,
          phone: newContactData.phone || null,
          mobile_phone: null,
          work_phone: null,
          fax: null,
          company: newContactData.company || null,
          jobTitle: newContactData.jobTitle || null,
          birthday: null,
          location: null,
          linkedinUrl: null,
          whatsapp: null,
          contactFrequency: 'uncategorized',
          lastContactedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });

      if (!contactResponse.ok) {
        throw new Error('Failed to create contact');
      }

      const newContact = await contactResponse.json();

      contacts = [...contacts, newContact];
      selectContact(newContact);

      newContactData = {
        fullName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: ''
      };
      showNewContactForm = false;

    } catch (error) {
      console.error('Error creating contact:', error);
    }
  }

  async function handleDeleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId })
      });

      if (response.ok) {
        contacts = contacts.filter(c => c.id !== contactId);

        // Clear selection if deleted contact was selected
        if (selectedContactId === contactId) {
          selectedContactId = '';
          formData.contactId = '';
          formData.contactName = '';
          formData.contactTitle = '';
          contactSearchQuery = '';
        }
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  }

  $: filteredContacts = contacts.filter(contact =>
    contact.fullName.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    (contact.company || '').toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    (contact.jobTitle || '').toLowerCase().includes(contactSearchQuery.toLowerCase())
  );


  function getStageColor(stage) {
    const stageInfo = stages.find(s => s.value === stage);
    return stageInfo ? stageInfo.color : 'from-gray-500 to-gray-600';
  }

  // Format number with commas for thousands
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Remove all non-numeric characters except dots
  function cleanNumber(str) {
    return str.replace(/[^\d]/g, '');
  }

  // Handle value input with real-time formatting
  function handleValueInput(event) {
    const input = event.target;
    const value = input.value;

    // Clean the input to only numbers
    const cleanedValue = cleanNumber(value);

    if (cleanedValue === '') {
      displayValue = '';
      formData.value = '';
      return;
    }

    // Format with commas
    const formatted = formatNumber(cleanedValue);
    displayValue = formatted;
    formData.value = cleanedValue;

    // Update cursor position to stay at the end
    setTimeout(() => {
      input.setSelectionRange(formatted.length, formatted.length);
    }, 0);
  }

  // Handle keypress to allow only numbers
  function handleValueKeypress(event) {
    const char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- Modal Backdrop -->
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
  >
    <!-- Modal Content -->
    <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/10">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600">
            <TrendingUp class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-white">
            {editingOpportunity ? 'Edit Pipeline Opportunity' : 'New Pipeline Opportunity'}
          </h2>
        </div>
        <button
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300"
          on:click={handleClose}
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="title" class="text-white/90">Deal Title *</Label>
              <Input
                id="title"
                bind:value={formData.title}
                placeholder="e.g., Enterprise Software Deal"
                class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                error={errors.title}
              />
              {#if errors.title}
                <p class="text-red-400 text-sm">{errors.title}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="company" class="text-white/90">Company *</Label>
              <div class="relative">
                <Building class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  id="company"
                  bind:value={formData.company}
                  placeholder="e.g., TechCorp Solutions"
                  class="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                  error={errors.company}
                />
              </div>
              {#if errors.company}
                <p class="text-red-400 text-sm">{errors.company}</p>
              {/if}
            </div>
          </div>

          <!-- Value, Expected Close Date, and Probability -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <Label for="value" class="text-white/90">Deal Value (Rp) *</Label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 font-medium">Rp</span>
                <input
                  id="value"
                  type="text"
                  bind:value={displayValue}
                  on:input={handleValueInput}
                  on:keypress={handleValueKeypress}
                  placeholder="250,000,000"
                  class="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent {errors.value ? 'border-red-400' : ''}"
                />
              </div>
              {#if errors.value}
                <p class="text-red-400 text-sm">{errors.value}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="expectedCloseDate" class="text-white/90">Expected Close Date *</Label>
              <DatePicker
                bind:value={formData.expectedCloseDate}
                placeholder="Select expected close date"
                class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              {#if errors.expectedCloseDate}
                <p class="text-red-400 text-sm">{errors.expectedCloseDate}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="probability" class="text-white/90">Probability (%)</Label>
              <div class="relative">
                <input
                  id="probability"
                  type="range"
                  min="0"
                  max="100"
                  bind:value={formData.probability}
                  class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <span class="text-white/90 text-sm font-medium">{formData.probability}%</span>
              </div>
            </div>
          </div>

          <!-- Stage Selection -->
          <div class="space-y-2">
            <Label class="text-white/90">Stage *</Label>
            <div class="flex flex-col md:flex-row gap-1 md:gap-0">
              {#each stages as stage, index}
                <label class="relative cursor-pointer flex-1">
                  <input
                    type="radio"
                    bind:group={formData.stage}
                    value={stage.value}
                    class="sr-only"
                  />
                  <div class="stage-arrow relative transition-all duration-300 {formData.stage === stage.value
                    ? 'bg-gradient-to-r ' + stage.color + ' shadow-lg z-10'
                    : 'bg-white/5 hover:bg-white/10'} {index === 0 ? 'first-stage' : ''} {index === stages.length - 1 ? 'last-stage' : ''}">
                    <div class="flex items-center space-x-3 relative z-10">
                      <svelte:component this={stage.icon} class="w-4 h-4 text-white flex-shrink-0" />
                      <span class="text-sm font-medium text-white whitespace-nowrap">{stage.value}</span>
                    </div>
                  </div>
                </label>
              {/each}
            </div>
            {#if errors.stage}
              <p class="text-red-400 text-sm mt-1">{errors.stage}</p>
            {/if}
          </div>


          <!-- Contact Information -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <Label class="text-white/90">Primary Contact *</Label>
              <button
                type="button"
                on:click={() => showNewContactForm = true}
                class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs flex items-center space-x-1 rounded-xl transition-all duration-300"
              >
                <Plus class="w-3 h-3" />
                <span>New Contact</span>
              </button>
            </div>

            <!-- Contact Search -->
            <div class="relative">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  bind:value={contactSearchQuery}
                  on:focus={() => showContactDropdown = true}
                  on:input={() => showContactDropdown = true}
                  on:blur={() => setTimeout(() => showContactDropdown = false, 150)}
                  placeholder="Search for a contact..."
                  class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Contact Dropdown -->
              {#if showContactDropdown && filteredContacts.length > 0}
                <div class="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-gray-800/95 backdrop-blur-lg border border-white/20 rounded-xl z-10 shadow-2xl">
                  {#each filteredContacts.slice(0, 5) as contact}
                    <div class="group relative flex items-center hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl">
                      <button
                        type="button"
                        class="flex-1 px-4 py-3 text-left"
                        on:click={() => selectContact(contact)}
                      >
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <User class="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div class="text-white font-medium">{contact.fullName}</div>
                            <div class="text-white/60 text-sm">
                              {contact.jobTitle || 'No title'}
                              {#if contact.company}
                                • {contact.company}
                              {/if}
                            </div>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        class="px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                        on:click={(e) => {
                          e.stopPropagation();
                          handleDeleteContact(contact.id);
                        }}
                        title="Delete contact"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Selected Contact Display -->
            {#if selectedContactId && formData.contactName}
              <div class="p-4 rounded-xl bg-white/5 border border-white/10">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                      <User class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="text-white font-medium">{formData.contactName}</div>
                      <div class="text-white/60 text-sm">
                        {formData.contactTitle || 'No title'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
                    on:click={() => {
                      selectedContactId = '';
                      formData.contactId = '';
                      formData.contactName = '';
                      formData.contactTitle = '';
                      contactSearchQuery = '';
                    }}
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            {/if}

            {#if errors.contact}
              <p class="text-red-400 text-sm">{errors.contact}</p>
            {/if}
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label for="description" class="text-white/90">Description *</Label>
            <Textarea
              id="description"
              bind:value={formData.description}
              placeholder="Describe the opportunity, what's being sold, key requirements, and any important details..."
              rows={4}
              class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              error={errors.description}
            />
            {#if errors.description}
              <p class="text-red-400 text-sm">{errors.description}</p>
            {/if}
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-white/10">
        <div>
          {#if editingOpportunity}
            <button
              type="button"
              on:click={handleDelete}
              class="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <Trash2 class="w-4 h-4" />
              <span>Delete</span>
            </button>
          {/if}
        </div>
        <div class="flex items-center space-x-4">
          <button
            type="button"
            on:click={handleClose}
            class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            on:click={handleSubmit}
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300"
          >
{editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Contact Creation Modal -->
{#if showNewContactForm}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
    <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/10">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-600">
            <User class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-white">Create New Contact</h2>
        </div>
        <button
          type="button"
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300"
          on:click={() => showNewContactForm = false}
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Contact Form -->
      <form on:submit|preventDefault={handleCreateContact} class="p-6 space-y-4">
        <div class="space-y-2">
          <Label for="newContactName" class="text-white/90">Full Name *</Label>
          <Input
            id="newContactName"
            bind:value={newContactData.fullName}
            placeholder="Enter full name"
            class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="newContactEmail" class="text-white/90">Email</Label>
            <Input
              id="newContactEmail"
              type="email"
              bind:value={newContactData.email}
              placeholder="Enter email"
              class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div class="space-y-2">
            <Label for="newContactPhone" class="text-white/90">Phone</Label>
            <Input
              id="newContactPhone"
              bind:value={newContactData.phone}
              placeholder="Enter phone number"
              class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="newContactCompany" class="text-white/90">Company</Label>
            <Input
              id="newContactCompany"
              bind:value={newContactData.company}
              placeholder="Enter company name"
              class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div class="space-y-2">
            <Label for="newContactTitle" class="text-white/90">Job Title</Label>
            <Input
              id="newContactTitle"
              bind:value={newContactData.jobTitle}
              placeholder="Enter job title"
              class="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
            on:click={() => showNewContactForm = false}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Create Contact
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #10b981, #3b82f6);
    border-radius: 50%;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #10b981, #3b82f6);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }

  /* Arrow-shaped stage boxes */
  .stage-arrow {
    position: relative;
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 16px 50%);
    margin-right: -14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 28px 16px 28px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  /* First stage - no left arrow point */
  .stage-arrow.first-stage {
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
    border-radius: 12px 0 0 12px;
    padding: 16px 28px 16px 20px;
    z-index: 2;
  }

  /* Last stage - no right arrow point */
  .stage-arrow.last-stage {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 16px 50%);
    margin-right: 0;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px 16px 28px;
    z-index: 1;
  }

  /* First stage is also last (single stage) */
  .stage-arrow.first-stage.last-stage {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    margin-right: 0;
    border-radius: 12px;
    padding: 16px 20px;
    z-index: 1;
  }

  /* Mobile styles - stack vertically with modified arrows */
  @media (max-width: 768px) {
    .stage-arrow {
      clip-path: polygon(0% 0%, 100% 0%, calc(100% - 20px) 50%, 100% 100%, 0% calc(100% - 20px), 20px 50%);
      margin-right: 0;
      margin-bottom: -16px;
      padding: 16px 20px 28px 20px;
      justify-content: flex-start;
    }

    .stage-arrow.first-stage {
      clip-path: polygon(0% 0%, 100% 0%, calc(100% - 20px) 50%, 100% 100%, 0% calc(100% - 20px));
      border-radius: 12px 12px 0 0;
      padding: 16px 20px 28px 20px;
    }

    .stage-arrow.last-stage {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% calc(100% - 20px), 20px 50%);
      border-radius: 0 0 12px 12px;
      margin-bottom: 0;
      padding: 28px 20px 16px 20px;
    }

    .stage-arrow.first-stage.last-stage {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
      border-radius: 12px;
      margin-bottom: 0;
      padding: 16px 20px;
    }
  }

  /* Enhanced styling for selected stage */
  .stage-arrow:has(input:checked) {
    transform: scale(1.02);
    border-color: rgba(255, 255, 255, 0.3);
  }
</style>
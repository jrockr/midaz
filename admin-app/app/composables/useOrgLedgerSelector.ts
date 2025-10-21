// Composable for organization/ledger selector logic

import { ref, computed, watch, onMounted } from 'vue'
import { useOrganizationsStore } from '@/stores/organizations'
import { useLedgersStore } from '@/stores/ledgers'
import { storage } from '@/utils/storage'

export function useOrgLedgerSelector() {
  const organizationsStore = useOrganizationsStore()
  const ledgersStore = useLedgersStore()

  const orgSearchQuery = ref('')
  const ledgerSearchQuery = ref('')
  const selectedOrgId = ref(storage.getSelectedOrg() || '')
  const selectedLedgerId = ref(storage.getSelectedLedger() || '')
  const loading = ref(false)

  const filteredOrganizations = computed(() => {
    if (!orgSearchQuery.value) return organizationsStore.items
    const query = orgSearchQuery.value.toLowerCase()
    return organizationsStore.items.filter(org => 
      org.name.toLowerCase().includes(query) || 
      org.id.toLowerCase().includes(query)
    )
  })

  const filteredLedgers = computed(() => {
    if (!ledgerSearchQuery.value) return ledgersStore.items
    const query = ledgerSearchQuery.value.toLowerCase()
    return ledgersStore.items.filter(ledger => 
      ledger.name.toLowerCase().includes(query) || 
      ledger.id.toLowerCase().includes(query)
    )
  })

  const isReady = computed(() => !!selectedOrgId.value && !!selectedLedgerId.value)

  watch(selectedOrgId, async (newOrgId) => {
    if (newOrgId) {
      storage.setSelectedOrg(newOrgId)
      selectedLedgerId.value = ''
      loading.value = true
      try {
        await ledgersStore.fetchAll({ organizationId: newOrgId, limit: 100 })
      } finally {
        loading.value = false
      }
    } else {
      storage.clearSelections()
    }
  })

  watch(selectedLedgerId, (newLedgerId) => {
    if (newLedgerId) {
      storage.setSelectedLedger(newLedgerId)
    }
  })

  onMounted(async () => {
    loading.value = true
    try {
      await organizationsStore.fetchAll({ limit: 100 })
      if (selectedOrgId.value) {
        await ledgersStore.fetchAll({ organizationId: selectedOrgId.value, limit: 100 })
      }
    } finally {
      loading.value = false
    }
  })

  return {
    orgSearchQuery,
    ledgerSearchQuery,
    selectedOrgId,
    selectedLedgerId,
    filteredOrganizations,
    filteredLedgers,
    isReady,
    loading,
  }
}

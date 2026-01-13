import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const balance = ref(parseInt(localStorage.getItem('gabbie_coins')) || 100)
  const isPremium = ref(localStorage.getItem('gabbie_premium') === 'true')
  // Load unlocked items from localStorage, defaulting to empty array
  const unlockedItems = ref(JSON.parse(localStorage.getItem('gabbie_unlocked_items')) || [])

  function addCoins(amount) {
    balance.value += amount
    save()
  }

  function spendCoins(amount) {
    if (balance.value >= amount) {
      balance.value -= amount
      save()
      return true
    }
    return false
  }

  function hasUnlocked(itemId) {
    return unlockedItems.value.includes(itemId)
  }

  function purchaseItem(itemId, cost) {
    if (hasUnlocked(itemId)) return true // Already owned
    
    if (balance.value >= cost) {
      balance.value -= cost
      unlockedItems.value.push(itemId)
      save()
      return true
    }
    return false
  }

  function save() {
    localStorage.setItem('gabbie_coins', balance.value)
    localStorage.setItem('gabbie_premium', isPremium.value)
    localStorage.setItem('gabbie_unlocked_items', JSON.stringify(unlockedItems.value))
  }

  return { 
    balance, 
    isPremium, 
    unlockedItems,
    addCoins, 
    spendCoins,
    hasUnlocked,
    purchaseItem
  }
})

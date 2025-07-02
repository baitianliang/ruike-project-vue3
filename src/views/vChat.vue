<template>
  <div>
    <vue-advanced-chat
      height="calc(100vh - 20px)"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :rooms-loaded="true"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      @add-room="addRoom($event.detail[0])"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
      :show-files="false"
      :show-audio="false"
      :show-emojis="false"
    />
    <div v-if="isLoading" class="loading-indicator">
      正在思考中...
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { register } from 'vue-advanced-chat'
import DeepSeekService from '@/services/deepseek'
register()
const currentUserId = ref('user1'),
rooms = ref([{
      roomId: '1',
      roomName: 'DeepSeek 助手',
      avatar: 'https://example.com/ai-avatar.png',
      users: [{ _id: 'user1', username: '我' }]
    }
]),
messages = ref([]),
messagesLoaded = ref(false),
isLoading = ref(false)
function fetchMessages({ options = {} }) {
    setTimeout(() => {
        if (options.reset) {
            // messages.value = addMessages(true)
        } else {
            // messages.value = [...addMessages(), ...messages.value]
            messagesLoaded.value = true
        }
    })
}

function addMessages(reset) {
    let messagesList = []
    for (let i = 0; i < 30; i++) {
        messagesList.push({
            _id: reset ? i : messages.value.length + i,
            content: `${reset ? '' : 'paginated'} message ${i + 1}`,
            senderId: '4321',
            username: 'John Doe',
            date: '13 November',
            timestamp: '10:20'
        })
    }
    return messagesList
}
// 添加聊天框
function addRoom(val) {
    rooms.value.unshift({
        roomId: `${rooms.value.length + 1}`,
        roomName: `DeepSeek 助手${rooms.value.length + 1}`,
        users: rooms.value[0].users
    })
}
// 发送消息
function sendMessage(message) {
    messages.value = [
        ...messages.value,
        {
            _id: Date.now().toString(),
            content: message.content,
            senderId: currentUserId,
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
        }
    ]
    addNewMessage(message)
}

async function addNewMessage(message) {
    // setTimeout(() => {
    //     messages.value = [
    //         ...messages.value,
    //         {
    //             _id: messages.value.length,
    //             content: 'NEW MESSAGE',
    //             senderId: roomId,
    //             timestamp: new Date().toString().substring(16, 21),
    //             date: new Date().toDateString()
    //         }
    //     ]
    // }, 2000)
    try {
        const recentMessages = messages.value.slice(-6).map(msg => ({
            role: msg.senderId === currentUserId.value ? 'user' : 'assistant',
            content: msg.content
        }))
        // 调用 DeepSeek API
        const aiResponse = await DeepSeekService.getCompletion(recentMessages)
        
        // 添加 AI 回复
        messages.value.push({
          _id: (Date.now() + 1).toString(),
          content: aiResponse,
          senderId: message.roomId,
          timestamp: new Date().toString().substring(16, 21),
          saved: true,
          distributed: true,
          seen: true
        })
      } finally {
        isLoading.value = false
      }
}
</script>

<style lang="scss">
.loading-indicator {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  z-index: 1000;
}
</style>
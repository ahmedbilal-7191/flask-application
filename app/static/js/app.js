document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('messageForm');
  const input = document.getElementById('messageInput');
  const list = document.getElementById('messageList');

  const modal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const closeModal = document.getElementById('closeModal');
  const saveEdit = document.getElementById('saveEdit');

  let editId = null;

  async function fetchMessages() {
    const res = await fetch('/messages');
    const messages = await res.json();
    list.innerHTML = '';
    messages.forEach(msg => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>#${msg.id}</strong>: ${msg.message}
        <span class="message-actions">
          <button onclick="editMessage(${msg.id}, '${msg.message.replace(/'/g, "\\'")}')">Edit</button>
          <button onclick="deleteMessage(${msg.id})">Delete</button>
        </span>`;
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const message = input.value;
    await fetch('/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    input.value = '';
    fetchMessages();
  });

  window.deleteMessage = async (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await fetch(`/messages/${id}`, { method: 'DELETE' });
      fetchMessages();
    }
  };

  window.editMessage = (id, currentMsg) => {
    editId = id;
    editInput.value = currentMsg;
    modal.style.display = 'block';
  };

  saveEdit.addEventListener('click', async () => {
    const newMsg = editInput.value;
    await fetch(`/messages/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMsg })
    });
    modal.style.display = 'none';
    fetchMessages();
  });

  closeModal.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if (e.target == modal) modal.style.display = 'none'; };

  fetchMessages();
});

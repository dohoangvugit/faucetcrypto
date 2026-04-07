document.querySelectorAll('.visit-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (btn.disabled || btn.dataset.completed === "true") return;

    const taskId = Number(btn.dataset.taskId);
    const link = btn.dataset.linkUrl;
    const cooldownSeconds = Number(btn.dataset.cooldown)

    btn.disabled = true;              
    btn.innerText = `Waiting ${cooldownSeconds}s`

    window.open(link, '_blank');     

    let remaining = cooldownSeconds;

    const countdown = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        btn.innerText = `Waiting ${remaining}s`;
      }
    }, 1000);

    try {
      const { data, error } = await supabaseClient.rpc('claim_task', {
        p_task_id: taskId,
        p_user_id: window.userId
      });

      clearInterval(countdown);

      if (error || data?.error) {
        alert(data?.error || error.message);
        btn.disabled = false;
        btn.innerText = 'Visit';
        return;
      }

      handleBalance(data.reward);
      btn.innerText = 'Completed';
      btn.classList.remove('btn-success');
      btn.classList.add('btn-secondary');
      btn.dataset.completed = "true";   
    } catch (err) {
      clearInterval(countdown);
      console.error(err);
      btn.disabled = false;
      btn.innerText = 'Visit';
      alert('Có lỗi xảy ra khi nhận thưởng');
    }
  });
});

function handleBalance(reward) {
  const balanceEl = document.getElementById('balance')
  if (!balanceEl) return

  const current = parseFloat(balanceEl.innerText || '0')
  balanceEl.innerText = (current + parseFloat(reward)).toFixed(8)
}

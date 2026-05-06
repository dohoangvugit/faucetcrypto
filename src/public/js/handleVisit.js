const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const buttons = $$('.visit-btn')

buttons.forEach(button => {
    button.addEventListener('click', handleVisitClick)
})

async function handleVisitClick(button) {
    const taskId = button.getAttribute('data-task-id')
    const linkUrl = button.getAttribute('data-link-url')
    const cooldown = parseInt(button.getAttribute('data-cooldown'), 10)

    setButtonWaiting(button, cooldown)

    try {
        const startResult = await startTask(taskId)
        if (startResult.error){
            return resetButton(button, startResult.error)
        } 

        openTaskLink(linkUrl)

        const timer = startCountdown(button, cooldown)
        await delay(cooldown)

        const claimResult = await claimTask(taskId)
        clearInterval(timer)

        if (claimResult.error){
            return resetButton(button, claimResult.error)
        }

        updateBalance(claimResult.newBalance)
        markCompleted(button)

    } catch (err) {
        console.error(err)
        resetButton(button, 'Có lỗi xảy ra khi nhận thưởng')
    }
}

async function startTask(taskId) {
    const res = await fetch('/client/tasks/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
    })

    const data = await res.json()
    if (!res.ok || data?.error) {
        return { error: data?.error || 'Không thể bắt đầu nhiệm vụ' }
    }

    return data
}

async function claimTask(taskId) {
    const res = await fetch('/client/tasks/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
    })

    const data = await res.json()
    if (!res.ok || data?.error) {
        return { error: data?.error || 'Không thể nhận thưởng' }
    }

    return data
}

function setButtonWaiting(button, cooldown) {
    button.disabled = true
    button.innerText = `Wait ${cooldown}s`
}

function resetButton(button, message) {
    alert(message)
    button.disabled = false
    button.innerText = 'Visit'
}

function markCompleted(button) {
    button.innerText = 'Completed'
    button.classList.remove('btn-success')
    button.classList.add('btn-secondary')
    button.dataset.completed = 'true'
}

function updateBalance(newBalance) {
    const balanceEl = $('#balance')
    if (balanceEl) {
        balanceEl.innerText = Number(newBalance).toFixed(8)
    }
}

function openTaskLink(url) {
    window.open(url, '_blank')
}

function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

function startCountdown(button, seconds) {
    let timeLeft = seconds

    return setInterval(() => {
        timeLeft--
        if (timeLeft > 0) {
            button.innerText = `Wait ${timeLeft}s`
        }
    }, 1000)
}
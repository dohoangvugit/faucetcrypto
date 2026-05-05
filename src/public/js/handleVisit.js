document.querySelectorAll('.visit-btn').forEach(button => {
    button.addEventListener('click', async function () {
        if (this.disabled || this.dataset.completed === 'true') return

        const taskId = this.getAttribute('data-task-id')
        const linkUrl = this.getAttribute('data-link-url')
        const cooldown = parseInt(this.getAttribute('data-cooldown'), 10)

        this.disabled = true
        this.innerText = `Wait ${cooldown}s`

        try {
            const startResponse = await fetch('/client/tasks/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId })
            })

            const startResult = await startResponse.json()

            if (!startResponse.ok || startResult?.error) {
                alert(startResult?.error || 'Không thể bắt đầu nhiệm vụ')
                this.disabled = false
                this.innerText = 'Visit'
                return
            }

            window.open(linkUrl, '_blank')

            let timeLeft = cooldown
            const timer = setInterval(() => {
                timeLeft--
                if (timeLeft > 0) {
                    this.innerText = `Wait ${timeLeft}s`
                }
            }, 1000)

            await new Promise(resolve => setTimeout(resolve, cooldown * 1000))

            const claimResponse = await fetch('/client/tasks/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId })
            })

            const claimResult = await claimResponse.json()
            clearInterval(timer)

            if (!claimResponse.ok || claimResult?.error) {
                alert(claimResult?.error || 'Không thể nhận thưởng')
                this.disabled = false
                this.innerText = 'Visit'
                return
            }

            const balanceEl = document.getElementById('balance')
            if (balanceEl) {
                balanceEl.innerText = Number(claimResult.newBalance).toFixed(8)
            }

            this.innerText = 'Completed'
            this.classList.remove('btn-success')
            this.classList.add('btn-secondary')
            this.dataset.completed = 'true'
        } catch (err) {
            console.error(err)
            alert('Có lỗi xảy ra khi nhận thưởng')
            this.disabled = false
            this.innerText = 'Visit'
        }
    })
})

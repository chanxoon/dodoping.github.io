document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('[data-include]');
    let count = 0;

    targets.forEach(el => {
        fetch(el.dataset.include)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load ${el.dataset.include}`);
                return res.text();
            })
            .then(html => {
                el.innerHTML = html;
                count++;

                if (count === targets.length) {
                    document.dispatchEvent(new Event('include:done'));
                }
            })
            .catch(err => {
                console.error(err);
            });
    });
});

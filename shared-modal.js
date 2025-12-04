/* shared-modal.js
   Injects the Service Request modal if it's missing and wires open/close
   handlers so any page can include this file and use `.request-service-btn`.
   This file is framework-free and has no external dependencies.
*/
(function () {
    if (document.getElementById('serviceModal')) return; // modal already present

    const modalHtml = `
    <div id="serviceModal" class="modal" aria-hidden="true">
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="modal-header">
                <h2 class="modal-title">Request Our Services</h2>
                <p class="modal-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>
            <form id="serviceForm" class="service-form">
                <div class="form-group">
                    <label for="fullName">Full Name <span class="required">*</span></label>
                    <input type="text" id="fullName" name="fullName" required placeholder="John Doe">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email Address <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required placeholder="john@company.com">
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number <span class="required">*</span></label>
                        <input type="tel" id="phone" name="phone" required placeholder="+1 (555) 123-4567">
                    </div>
                </div>

                <div class="form-group">
                    <label for="company">Company Name</label>
                    <input type="text" id="company" name="company" placeholder="Your Company Inc.">
                </div>

                <div class="form-group">
                    <label for="service">Service Needed <span class="required">*</span></label>
                    <select id="service" name="service" required>
                        <option value="">Select a service</option>
                        <option value="cloud-infrastructure">Cloud Infrastructure</option>
                        <option value="cybersecurity">Cybersecurity</option>
                        <option value="software-development">Software Development</option>
                        <option value="it-consulting">IT Consulting</option>
                        <option value="data-analytics">Data Analytics</option>
                        <option value="support">24/7 Support</option>
                        <option value="multiple">Multiple Services</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="budget">Project Budget</label>
                    <select id="budget" name="budget">
                        <option value="">Select budget range</option>
                        <option value="under-10k">Under $10,000</option>
                        <option value="10k-50k">$10,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k-500k">$100,000 - $500,000</option>
                        <option value="over-500k">Over $500,000</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="message">Project Details <span class="required">*</span></label>
                    <textarea id="message" name="message" rows="5" required
                        placeholder="Tell us about your project requirements, timeline, and any specific needs..."></textarea>
                </div>

                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="newsletter" value="yes">
                        <span>I'd like to receive updates and newsletters about IT solutions</span>
                    </label>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn-primary">Submit Request</button>
                </div>
            </form>
        </div>
    </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper.firstElementChild);

    // Expose a small API to open/close modal for other scripts
    const serviceModal = document.getElementById('serviceModal');
    const modalOverlay = serviceModal.querySelector('.modal-overlay');
    const modalClose = serviceModal.querySelector('.modal-close');
    const cancelBtn = serviceModal.querySelector('#cancelBtn');
    const serviceForm = serviceModal.querySelector('#serviceForm');

    function openSharedModal() {
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSharedModal() {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
        if (serviceForm) serviceForm.reset();
    }

    // Delegate: any element with .request-service-btn opens the modal
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.request-service-btn');
        if (!btn) return;
        // don't react to clicks that are inside the modal itself
        if (e.target.closest('#serviceModal')) return;
        e.preventDefault();
        openSharedModal();
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeSharedModal);
    if (modalClose) modalClose.addEventListener('click', closeSharedModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeSharedModal);

    // Basic form submission fallback (for pages that only include shared-modal.js)
    if (serviceForm) {
        serviceForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            // Basic client-side validation
            const fullName = formData.get('fullName') || '';
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const service = formData.get('service') || '';
            const message = formData.get('message') || '';

            if (!fullName || !email || !phone || !service || !message) {
                alert('Please fill out the required fields');
                return;
            }

            // Simulate submission
            alert('Thank you! Your request has been submitted.');
            closeSharedModal();
        });
    }

    // Expose API
    window.sharedServiceModal = {
        open: openSharedModal,
        close: closeSharedModal
    };

})();

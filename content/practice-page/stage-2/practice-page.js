/*
 * Behaviour for both language variants of the Stage 2 subject. One file, loaded
 * by both, so the two cannot drift apart.
 *
 * Every word the flow says lives in the markup. This file moves values, shows
 * and hides panels, and times the one authored wait — it holds no sentence in
 * either language, which is what keeps a Korean walk and an English walk the
 * same walk. Nothing here labels a planted defect.
 *
 * Comments are stripped before this is served, so use block comments only:
 * an authoring note is documentation for a maintainer and a hint for a Learner.
 *
 * The flow never branches (ADR-0010). Every walk visits step 1, then 2, then 3;
 * no value entered anywhere decides which step comes next or which control it
 * carries. Cancel and Confirm leave the flow rather than fork it.
 */
(function () {
  var body = document.body
  var forEach = function (list, fn) {
    Array.prototype.forEach.call(list, fn)
  }

  /* Panels: the three steps, plus the confirmation the flow ends on. */
  var panels = document.querySelectorAll('[data-step-label]')
  var steps = {}
  forEach(document.querySelectorAll('[data-step]'), function (section) {
    steps[section.getAttribute('data-step')] = section
  })

  var indicator = document.getElementById('step-indicator')
  var confirmation = document.getElementById('confirmation')
  var cancelConfirm = document.getElementById('cancel-confirm')
  var availability = document.getElementById('availability-result')
  var email = document.getElementById('driver-email')
  var emailError = document.getElementById('driver-email-error')
  var contactPhone = document.getElementById('contact-phone')
  var confirmError = document.getElementById('confirm-error')

  /* Which control holds each value the flow echoes back later. */
  var SOURCES = {
    branch: 'branch',
    pickup: 'pickup-date',
    return: 'return-date',
    name: 'driver-name',
    email: 'driver-email',
  }

  function valueOf(key) {
    /* Cover is the one value chosen from a group rather than held by a single
     * control, so it is read from whichever option is picked. */
    if (key === 'cover') {
      var chosen = document.querySelector('input[name="cover"]:checked')
      return chosen ? chosen.parentNode.querySelector('.choice-name').textContent : ''
    }
    var field = document.getElementById(SOURCES[key])
    if (!field) return ''
    if (field.tagName === 'SELECT') return field.options[field.selectedIndex].text
    return field.value
  }

  /*
   * Write the entered values into whichever slots a node carries. Two
   * attributes, because they are filled at different moments: `data-fill` is a
   * live echo, rewritten every time its panel is shown, while `data-answer` is
   * a sentence the flow said once, at the moment it was asked.
   */
  function fill(root, attribute) {
    forEach(root.querySelectorAll('[' + attribute + ']'), function (slot) {
      slot.textContent = valueOf(slot.getAttribute(attribute))
    })
  }

  function show(panel) {
    forEach(panels, function (other) {
      other.hidden = other !== panel
    })
    cancelConfirm.hidden = true
    indicator.textContent = panel.getAttribute('data-step-label')
    fill(panel, 'data-fill')
    panel.querySelector('.step-heading').focus()
    window.scrollTo(0, 0)
  }

  /*
   * Back to what the step was authored holding, not to empty: a field that
   * arrived carrying a sensible value should still carry it after a restart,
   * or the flow would ask every returning driver to supply what it knew a
   * moment ago.
   */
  function clearStep(number) {
    forEach(steps[number].querySelectorAll('input, select'), function (field) {
      if (field.tagName === 'SELECT') field.selectedIndex = 0
      else if (field.type === 'radio' || field.type === 'checkbox') field.checked = field.defaultChecked
      else field.value = field.defaultValue
    })
    markEmail()
    holdReturnAfterPickup()
  }

  function clearEverything() {
    Object.keys(steps).forEach(clearStep)
    availability.hidden = true
    confirmError.hidden = true
  }

  /* Step navigation. A button says which panel it leads to, and optionally
   * which step it empties on the way. */
  forEach(document.querySelectorAll('[data-next]'), function (button) {
    button.addEventListener('click', function () {
      var reset = button.getAttribute('data-reset')
      if (reset) clearStep(reset)
      show(steps[button.getAttribute('data-next')])
    })
  })

  /* Leaving the flow: asked for, confirmed, then back to an empty first step. */
  var cancelledFrom = null
  forEach(document.querySelectorAll('[data-cancel]'), function (button) {
    button.addEventListener('click', function () {
      cancelledFrom = button
      cancelConfirm.hidden = false
      document.getElementById('cancel-confirm-text').focus()
    })
  })
  document.getElementById('cancel-keep').addEventListener('click', function () {
    cancelConfirm.hidden = true
    if (cancelledFrom) cancelledFrom.focus()
  })
  document.getElementById('cancel-confirmed').addEventListener('click', function () {
    clearEverything()
    show(steps['1'])
  })

  /*
   * A van cannot come back before it goes out, so the return date offers
   * nothing earlier than the pickup date. Stated as a constraint on the
   * control rather than as a message after the fact — the date picker simply
   * does not hand over an impossible day.
   */
  var pickupDate = document.getElementById('pickup-date')
  var returnDate = document.getElementById('return-date')

  function holdReturnAfterPickup() {
    returnDate.min = pickupDate.value
  }

  pickupDate.addEventListener('change', holdReturnAfterPickup)
  holdReturnAfterPickup()

  /* The authored wait. It performs no work and asks nothing of the network:
   * the delay and its answer are both written here. */
  var pending = false
  document.getElementById('check-availability').addEventListener('click', function () {
    if (pending) return
    pending = true
    window.setTimeout(function () {
      pending = false
      fill(availability, 'data-answer')
      availability.hidden = false
    }, 6000)
  })

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function markEmail() {
    var wrong = email.value !== '' && !EMAIL.test(email.value)
    emailError.hidden = !wrong
    email.classList.toggle('is-invalid', wrong)
    if (wrong) email.setAttribute('aria-invalid', 'true')
    else email.removeAttribute('aria-invalid')
  }

  email.addEventListener('input', markEmail)

  document.getElementById('confirm-booking').addEventListener('click', function () {
    if (contactPhone.value.trim() === '') {
      confirmError.hidden = false
      return
    }
    confirmError.hidden = true
    show(confirmation)
  })

  document.getElementById('new-booking').addEventListener('click', function () {
    clearEverything()
    show(steps['1'])
  })

  /*
   * The audit tools (ADR-0010). Two named modes, because a subject that must be
   * operated and a subject that must be pointed at contend for the same click.
   * The active mode is stated in words and announced, never by appearance
   * alone. Restart re-walks the flow without discarding what was entered.
   */
  var modeState = document.getElementById('audit-mode-state')
  var modes = document.querySelectorAll('[data-mode]')
  forEach(modes, function (button) {
    button.addEventListener('click', function () {
      body.setAttribute('data-audit-mode', button.getAttribute('data-mode'))
      forEach(modes, function (other) {
        other.setAttribute('aria-pressed', other === button ? 'true' : 'false')
      })
      modeState.textContent = button.getAttribute('data-mode-state')
    })
  })

  document.getElementById('audit-restart').addEventListener('click', function () {
    show(steps['1'])
  })
})()

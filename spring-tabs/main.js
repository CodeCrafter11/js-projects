class Vec2 {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
  
    add(v) {
      this.x += v.x
      this.y += v.y
      return this
    }
  
    scale(n) {
      this.x *= n
      this.y *= n
      return this
    }
  
    get magnitudeSquared() {
      return this.x * this.x + this.y * this.y
    }
  
    get magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    }
  
    get unitVector() {
      const result = new Vec2(0, 0)
      const length = this.magnitude
      if (length !== 0) {
        result.x = this.x / length
        result.y = this.y / length
      }
      return result
    }
  
    static scale(v, n) {
      return new Vec2(v.x, v.y).scale(n)
    }
  
    static sub(v1, v2) {
      return new Vec2(v1.x - v2.x, v1.y - v2.y)
    }
  }
  
  class BoxShape {
    constructor(width, height, inset) {
      this.width = width
      this.height = height
      this.inset = inset || { top: 0, right: 0, bottom: 0, left: 0 }
    }
  }
  
  class CircleShape {
    constructor(radius) {
      this.radius = radius
    }
  }
  
  class Force {
    static generateSpringForce(body, anchor, restLength, k, b) {
      const d = Vec2.sub(body.position, anchor)
      const displacement = d.magnitude - restLength
  
      const springDirection = d.unitVector
      const springMagnitude = -k * displacement
  
      const dampingMagnitude = body.velocity.magnitude * -b
  
      const magnitude = dampingMagnitude + springMagnitude
  
      return Vec2.scale(springDirection, magnitude)
    }
  }
  
  class Body {
    constructor(shape, x, y, mass) {
      this.shape = shape
      this.mass = mass
      this.invMass = mass !== 0 ? 1 / mass : 0
      this.initialPosition = new Vec2(x, y)
      this.position = new Vec2(x, y)
      this.velocity = new Vec2(0, 0)
      this.acceleration = new Vec2(0, 0)
      this.sumForces = new Vec2(0, 0)
    }
  
    get relPosition() {
      return Vec2.sub(this.position, this.initialPosition)
    }
  
    update(dt) {
      this.integrateLinear(dt)
    }
  
    addForce(force) {
      this.sumForces.add(force)
    }
  
    clearForces() {
      this.sumForces = new Vec2(0, 0)
    }
  
    integrateLinear(dt) {
      this.acceleration = Vec2.scale(this.sumForces, this.invMass)
      this.velocity.add(Vec2.scale(this.acceleration, dt))
      this.position.add(Vec2.scale(this.velocity, dt))
  
      this.clearForces()
    }
  }
  
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
  
  let previousTime = 0
  
  const SWITCHER_EDGE_OFFSET = 5
  
  let isDragging = false
  
  const tabsContainerEl = document.querySelector('.tabs')
  const tabsRect = tabsContainerEl.getBoundingClientRect()
  
  const switcherEl = document.querySelector('.switcher')
  const switcherRect = switcherEl.getBoundingClientRect()
  
  const anchorEl = document.createElement('div')
  anchorEl.style.position = 'absolute'
  tabsContainerEl.appendChild(anchorEl)
  
  const tabEls = Array.from(tabsContainerEl.querySelectorAll('.tab'))
  
  const tabActiveEls = tabEls.map((tabEl) => {
    const rect = tabEl.getBoundingClientRect()
    const el = document.createElement('div')
    el.classList.add('active-tab')
    el.style.setProperty('--tab-text-color', tabEl.dataset.activeColor)
    el.textContent = tabEl.textContent
    el.style.left = `${
      rect.left - tabsContainerEl.getBoundingClientRect().left
    }px`
    return el
  })
  
  tabActiveEls.forEach((tabEl) => tabsContainerEl.appendChild(tabEl))
  
  const activeTabs = tabActiveEls.map((tab) => {
    const rect = tab.getBoundingClientRect()
    return new Body(
      new BoxShape(rect.width, rect.height, {
        left: rect.width,
        right: 0,
        top: 0,
        bottom: 0
      }),
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      1
    )
  })
  
  const tabs = tabEls.map((tab) => {
    const rect = tab.getBoundingClientRect()
    return new Body(
      new BoxShape(rect.width, rect.height),
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      1
    )
  })
  
  const tabsContainer = new Body(
    new BoxShape(tabsRect.width, tabsRect.height),
    tabsRect.left + tabsRect.width / 2,
    tabsRect.top + tabsRect.height / 2,
    1
  )
  const switcher = new Body(
    new BoxShape(switcherRect.width, switcherRect.height),
    switcherRect.left + switcherRect.width / 2,
    switcherRect.top + switcherRect.height / 2,
    1
  )
  const anchor = new Body(
    new CircleShape(2),
    switcher.position.x,
    switcher.position.y,
    1
  )
  
  const startMousePosition = new Vec2(0, 0)
  const startSwitcherPosition = new Vec2(
    switcher.position.x,
    switcher.position.y
  )
  
  updateActiveTabInset()
  
  switcherEl.addEventListener('pointerdown', (e) => {
    isDragging = true
    startMousePosition.x = e.clientX
    startMousePosition.y = e.clientY
  
    startSwitcherPosition.x = switcher.position.x
    startSwitcherPosition.y = switcher.position.y
  })
  
  document.addEventListener('pointermove', (e) => {
    if (!isDragging) return
    const switcherMouseDistance =
      startMousePosition.x - startSwitcherPosition.x
    const pointerX = e.clientX - switcherMouseDistance
  
    const minPosition =
      tabsContainer.position.x -
      tabsContainer.shape.width / 2 +
      switcher.shape.width / 2
  
    const maxPosition =
      tabsContainer.position.x +
      tabsContainer.shape.width / 2 -
      switcher.shape.width / 2
  
    switcher.position.x = clamp(
      pointerX,
      minPosition - SWITCHER_EDGE_OFFSET,
      maxPosition + SWITCHER_EDGE_OFFSET
    )
  
    tabs.forEach((tab) => {
      if (
        switcher.position.x + switcher.shape.width / 2 >=
        tab.position.x
      ) {
        anchor.position = { ...tab.position }
      }
    })
  })
  
  function updateActiveTabInset() {
    activeTabs.forEach((tab) => {
      const switcherRightEdge =
        switcher.position.x + switcher.shape.width / 2
      const switcherLeftEdge =
        switcher.position.x - switcher.shape.width / 2
      const tabLeftEdge = tab.position.x - tab.shape.width / 2
      const tabRightEdge = tab.position.x + tab.shape.width / 2
      tab.shape.inset.left = tab.shape.width
      if (!isDragging && tab.position.x === anchor.position.x) {
        tab.shape.inset.left = 0
        tab.shape.inset.right = 0
      }
      if (!isDragging) {
        return
      }
      tab.shape.inset.right = tabLeftEdge - switcherLeftEdge
      tab.shape.inset.left = switcherRightEdge - tabRightEdge
    })
  }
  
  tabsContainerEl.addEventListener('click', (e) => {
    if (!e.target.matches('.tab')) {
      return
    }
    const tabIndex = tabEls.indexOf(e.target)
    const tab = tabs[tabIndex]
    anchor.position = { ...tab.position }
    switcher.velocity = new Vec2(0, 0)
  })
  
  document.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false
    }
  })
  
  function tick(time) {
    let dt = (time - previousTime) / 1000
    if (dt > 0.016) {
      dt = 0.016
    }
    previousTime = time
  
    update(dt)
  
    render()
  
    requestAnimationFrame(tick)
  }
  
  function update(dt) {
    if (!isDragging) {
      const spring = Force.generateSpringForce(
        switcher,
        anchor.position,
        0,
        120,
        40
      )
      switcher.addForce(spring)
    } else {
      switcher.velocity = new Vec2(0, 0)
    }
  
    switcher.update(dt)
  
    updateActiveTabInset()
  }
  
  function render() {
    switcherEl.style.transform = `translate(${switcher.relPosition.x}px, ${switcher.relPosition.y}px)`
    anchorEl.style.transform = `translate(${anchor.relPosition.x}px, ${anchor.relPosition.y}px)`
    tabActiveEls.forEach((tab, index) => {
      const tabBody = activeTabs[index]
      const shape = tabBody.shape
      tab.style.clipPath = `inset(${shape.inset.top}px ${shape.inset.right}px ${shape.inset.bottom}px ${shape.inset.left}px)`
    })
  }
  
  requestAnimationFrame(tick)
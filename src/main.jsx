import { useEffect, useMemo, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const images = {
  hero: `${import.meta.env.BASE_URL}images/photo-1414235077428-338989a2e8c0.jpg`,
  scallop: `${import.meta.env.BASE_URL}images/photo-1547592180-85f173990554.jpg`,
  duck: `${import.meta.env.BASE_URL}images/photo-1544025162-d76694265947.jpg`,
  dessert: `${import.meta.env.BASE_URL}images/photo-1563805042-7684c019e1cb.jpg`,
  restaurant: `${import.meta.env.BASE_URL}images/photo-1517248135467-4c7edcad34c4.jpg`,
  chef: `${import.meta.env.BASE_URL}images/photo-1577219491135-ce391730fb2c.jpg`,
  menu: `${import.meta.env.BASE_URL}images/photo-1552566626-52f8b828add9.jpg`,
  contact: `${import.meta.env.BASE_URL}images/photo-1517248135467-4c7edcad34c4.jpg`
}

const menuItems = [
  { category: 'Starters', name: 'Hokkaido Scallop', description: 'Green strawberry, buttermilk, finger lime', price: '24', image: images.scallop },
  { category: 'Starters', name: 'Charred Octopus', description: 'Nduja, smoked potato, preserved lemon', price: '22', image: `${import.meta.env.BASE_URL}images/photo-1559339352-11d035aa65de.jpg` },
  { category: 'Starters', name: 'Burrata & Fig', description: 'Aged balsamic, pistachio, purple basil', price: '19', image: `${import.meta.env.BASE_URL}images/photo-1573821663912-569905455b1c.jpg` },
  { category: 'Mains', name: 'Dry-Aged Duck', description: 'Roasted quince, celeriac, juniper jus', price: '42', image: images.duck },
  { category: 'Mains', name: 'Wild Mushroom Agnolotti', description: 'Black truffle, brown butter, parmesan', price: '34', image: `${import.meta.env.BASE_URL}images/photo-1473093295043-cdd812d0e601.jpg` },
  { category: 'Mains', name: 'Line-Caught Halibut', description: 'Fennel confit, mussel velouté, saffron', price: '39', image: `${import.meta.env.BASE_URL}images/photo-1515003197210-e0cd71810b5f.jpg` },
  { category: 'Desserts', name: 'Valrhona Chocolate', description: 'Olive oil gelato, sea salt, cocoa nib', price: '16', image: images.dessert },
  { category: 'Desserts', name: 'Honeyed Pear', description: 'Brown butter cake, almond, crème fraîche', price: '15', image: `${import.meta.env.BASE_URL}images/photo-1488477181946-6428a0291777.jpg` },
  { category: 'Drinks', name: 'The Garden 75', description: 'Gin, elderflower, lemon, sparkling wine', price: '17', image: `${import.meta.env.BASE_URL}images/photo-1513558161293-cdaf765ed2fd.jpg` },
  { category: 'Drinks', name: 'Smoked Old Fashioned', description: 'Rye, black tea, demerara, orange smoke', price: '18', image: `${import.meta.env.BASE_URL}images/photo-1470337458703-46ad1756a187.jpg` }
]

const links = [
  ['Home', 'home'], ['Menu', 'menu'], ['Reservations', 'reservations'], ['About', 'about'], ['Contact', 'contact']
]

function routeFromHash() {
  const route = window.location.hash.replace('#/', '').split('/')[0]
  return links.some(([, value]) => value === route) ? route : 'home'
}

function App() {
  const [route, setRoute] = useState(routeFromHash())
  const [menuOpen, setMenuOpen] = useState(false)
  const hasRendered = useRef(false)

  useEffect(() => {
    const update = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.title = `${links.find(([, id]) => id === route)[0]} — SAVOR Dining Concept`
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (hasRendered.current) document.getElementById('main-content')?.focus({ preventScroll: true })
    hasRendered.current = true
  }, [route])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        document.querySelector('.menu-toggle')?.focus()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  useEffect(() => {
    // Observe newly mounted cards as well as the initial route content.
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' })
    const observe = () => document.querySelectorAll('.reveal:not(.visible)').forEach(node => {
      node.classList.add('reveal-ready')
      observer.observe(node)
    })
    observe()
    const changes = new MutationObserver(observe)
    changes.observe(document.querySelector('main'), { childList: true, subtree: true })
    return () => { observer.disconnect(); changes.disconnect() }
  }, [route])

  const go = (to) => { window.location.hash = `/${to}` }

  return <>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content').focus() }}>Skip to content</a>
    <Header route={route} go={go} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main id="main-content" tabIndex="-1">
      {route === 'home' && <Home go={go} />}
      {route === 'menu' && <Menu />}
      {route === 'reservations' && <Reservations />}
      {route === 'about' && <About />}
      {route === 'contact' && <Contact />}
    </main>
    <Footer go={go} />
  </>
}

function Header({ route, go, menuOpen, setMenuOpen }) {
  return <header className="site-header">
    <a className="brand" href="#/home" aria-label="Savor home">SAVOR<span>·</span></a>
    <nav id="main-navigation" className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
      {links.map(([label, id]) => <a key={id} className={route === id ? 'active' : ''} aria-current={route === id ? 'page' : undefined} href={`#/${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
      <button className="mobile-book" onClick={() => go('reservations')}>Book a table</button>
    </nav>
    <button className="header-book" onClick={() => go('reservations')}>Book a table <Arrow /></button>
    <button className={menuOpen ? 'menu-toggle open' : 'menu-toggle'} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={menuOpen}><i></i><i></i></button>
  </header>
}

function Home({ go }) {
  return <>
    <section className="hero" style={{ backgroundImage: `url(${images.hero})` }}>
      <div className="hero-shade"></div>
      <div className="hero-content">
        <p className="eyebrow light">A table for the curious</p>
        <h1>Ingredients,<br /><em>elevated.</em></h1>
        <p className="hero-copy">A seasonally-led dining room where fire, memory and exceptional produce shape every plate.</p>
        <div className="hero-actions"><button className="button light-button" onClick={() => go('reservations')}>Reserve your table <Arrow /></button><button className="text-button" onClick={() => go('menu')}>Explore our menu <span>↓</span></button></div>
      </div>
      <div className="hero-meta"><span>Restaurant portfolio concept · San Francisco</span><span>Scroll to discover <b>↓</b></span></div>
    </section>

    <section className="intro section reveal" id="featured">
      <div><p className="eyebrow">The SAVOR table</p><h2>A singular expression<br />of <em>the season.</em></h2></div>
      <p className="large-copy">Our menu follows the rhythm of the growers, fishers and makers we know by name. Every visit is a new conversation with the season.</p>
    </section>

    <section className="feature-grid section reveal">
      <article className="feature-main image-card"><img loading="lazy" decoding="async" src={images.scallop} alt="Illustrative seasonal dish with vegetables" /><div className="image-card-caption"><p className="eyebrow light">From the kitchen</p><h3>Hokkaido scallop</h3><p>Green strawberry · Buttermilk · Finger lime</p></div></article>
      <div className="feature-side"><article className="dish-quote"><span className="quote-mark">“</span><p>Cooking is an act of attention: to the ingredient, the moment, and the people around the table.</p><span>— Chef Amara Voss</span></article><article className="image-card small"><img loading="lazy" decoding="async" src={images.duck} alt="Illustrative roasted meat dish" /><div className="image-card-caption"><h3>Dry-aged duck</h3><p>Roasted quince · Celeriac</p></div></article></div>
    </section>

    <section className="about-banner section reveal">
      <img loading="lazy" decoding="async" src={images.restaurant} alt="Warmly lit Savor dining room" />
      <div className="about-panel"><p className="eyebrow">Our philosophy</p><h2>Simple ideas.<br /><em>Remarkably done.</em></h2><p>At SAVOR, restraint is a luxury. Our approach is rooted in precise technique, honest flavor and a generous sense of occasion.</p><button className="text-button dark" onClick={() => go('about')}>Our story <Arrow /></button></div>
    </section>

    <section className="chef-section section reveal">
      <div className="chef-image"><img loading="lazy" decoding="async" src={images.chef} alt="A chef working in a professional kitchen" /><span>AMARA<br />VOSS</span></div>
      <div className="chef-copy"><p className="eyebrow">Meet the chef</p><h2>Led by instinct.<br /><em>Refined by craft.</em></h2><p>After kitchens from Copenhagen to Kyoto, Chef Amara Voss has created a dining experience that is at once deeply personal and effortlessly sophisticated.</p><button className="text-button dark" onClick={() => go('about')}>Meet Amara <Arrow /></button></div>
    </section>

    <ReviewStrip />
    <VisitSection go={go} />
  </>
}

function ReviewStrip() {
  const reviews = [['A menu shaped by the season.', 'THOUGHTFULLY SOURCED'], ['A warm welcome, from first course to last.', 'GENEROUS HOSPITALITY']]
  return <section className="reviews"><p className="eyebrow">At the SAVOR table</p><div className="review-list">{reviews.map(([quote, source]) => <blockquote key={source} className="reveal"><p>{quote}</p><cite>{source}</cite></blockquote>)}</div></section>
}

function VisitSection({ go }) {
  return <section className="visit section reveal"><div className="visit-image"><img loading="lazy" decoding="async" src={images.contact} alt="A warmly lit dining room with tables ready for dinner" /></div><div className="visit-heading"><p className="eyebrow">Join us</p><h2>There is always<br />room for <em>one more.</em></h2></div><div className="visit-info"><div><span>DINNER</span><p>Tuesday — Sunday<br />5:30 PM — 10:30 PM</p></div><div><span>BRUNCH</span><p>Saturday — Sunday<br />11:00 AM — 2:30 PM</p></div><div><span>FIND US</span><p>88 Vallejo Street<br />San Francisco, CA</p></div></div><button className="button dark-button" onClick={() => go('reservations')}>Reserve a table <Arrow /></button></section>
}

function PageHero({ eyebrow, title, image }) {
  return <section className="page-hero" style={{ backgroundImage: `url(${image})` }}><div></div><div className="page-hero-content"><p className="eyebrow light">Portfolio concept · {eyebrow}</p><h1>{title}</h1></div></section>
}

function Menu() {
  const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks']
  const [category, setCategory] = useState('All')
  const shown = useMemo(() => category === 'All' ? menuItems : menuItems.filter((item) => item.category === category), [category])
  return <><PageHero eyebrow="The SAVOR menu" title={<>A reason to<br /><em>gather.</em></>} image={images.menu} /><section className="menu-page section"><div className="menu-intro reveal"><p>Our menu changes with the market. These are a few of the dishes that capture the spirit of SAVOR right now.</p><span>Available Tuesday — Sunday</span></div><div className="filters reveal" role="group" aria-label="Menu categories">{categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="sr-only" role="status">{shown.length} dishes in {category.toLowerCase()}</p><div className="menu-grid">{shown.map((item) => <article className="menu-card reveal" key={item.name}><div className="menu-image"><img loading="lazy" decoding="async" src={item.image} alt={`Illustrative ${item.category.toLowerCase()} photograph`} /><span>{item.category}</span></div><div className="menu-card-content"><div><h3>{item.name}</h3><b>${item.price}</b></div><p>{item.description}</p></div></article>)}</div><p className="menu-note">Sample dishes and illustrative photography. Please let us know of any allergies or dietary requirements. A 20% service charge is added to parties of six or more.</p></section></>
}

const initialReservation = { name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: '' }
function Reservations() {
  const [data, setData] = useState(initialReservation); const [sent, setSent] = useState(false); const [errors, setErrors] = useState({})
  const change = (event) => { setData({ ...data, [event.target.name]: event.target.value, ...(event.target.name === 'date' ? { time: '' } : {}) }); setErrors({ ...errors, [event.target.name]: '' }) }
  const submit = (event) => { event.preventDefault(); const next = {}; ['name','email','phone','date','time','guests'].forEach((key) => { if (!data[key].trim()) next[key] = 'This field is required.' }); if (data.email && !/^\S+@\S+\.\S+$/.test(data.email.trim())) next.email = 'Enter a valid email address.'; if (data.phone && data.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a phone number with at least 7 digits.'; if (data.date && data.date < today()) next.date = 'Choose today or a future date.'; if (data.date && new Date(data.date + 'T12:00:00').getDay() === 1) next.date = 'We are closed on Mondays. Choose another date.'; if (data.time && !availableTimes(data.date).includes(data.time)) next.time = 'Choose a time available on this date.'; if (Object.keys(next).length) { setErrors(next); requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus()); return }; setSent(true) }
  return <><PageHero eyebrow="Reservations" title={<>Your table<br /><em>awaits.</em></>} image={images.restaurant} /><section className="form-layout section"><div className="form-aside reveal"><p className="eyebrow">Dine with us</p><h2>Make an<br /><em>evening of it.</em></h2><p>For parties of seven or more, private dining and special requests, please contact our reservations team directly.</p><p className="demo-note">Sample restaurant details for this portfolio concept. Contact and reservation forms are previews.</p></div><div className="form-wrap reveal">{sent ? <Success title="Your reservation preview." message={`Preview for ${data.guests} guests on ${data.date} at ${data.time}. This is a portfolio demo: no table has been booked and no request or email has been sent.`} action={() => setSent(false)} actionText="Edit reservation preview" /> : <form onSubmit={submit} noValidate><FormHeading title="Preview a reservation" /><div className="form-grid"><Field label="Full name" name="name" value={data.name} change={change} error={errors.name} /><Field label="Email address" name="email" type="email" value={data.email} change={change} error={errors.email} /><Field label="Phone number" name="phone" type="tel" value={data.phone} change={change} error={errors.phone} /><div className="field"><label htmlFor="guests">Guests</label><select id="guests" name="guests" value={data.guests} onChange={change}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select>{errors.guests && <small>{errors.guests}</small>}</div><Field label="Date" name="date" type="date" value={data.date} change={change} error={errors.date} min={today()} /><div className="field"><label htmlFor="time">Preferred time</label><select id="time" name="time" required aria-invalid={!!errors.time} aria-describedby={errors.time ? "time-error" : undefined} value={data.time} onChange={change}><option value="">Select a time</option>{availableTimes(data.date).map(time => <option key={time}>{time}</option>)}</select>{errors.time && <small id="time-error" role="alert">{errors.time}</small>}</div><div className="field full"><label htmlFor="notes">A note for our team <em>(optional)</em></label><textarea id="notes" name="notes" maxLength="2000" rows="4" value={data.notes} onChange={change} placeholder="Allergies, celebrations or requests"></textarea></div></div><button className="button dark-button submit-button" type="submit">Preview reservation <Arrow /></button><p className="form-footnote">Portfolio demo only. Your details stay in this page; this form does not send emails or book a table. Closed Mondays; brunch is available on weekends.</p></form>}</div></section></>
}

function FormHeading({ title }) { return <div className="form-heading"><p className="eyebrow">{title}</p><span>All fields except notes are required</span></div> }
function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function availableTimes(date) {
  const day = date ? new Date(date + 'T12:00:00').getDay() : null
  if (day === 1) return []
  const dinner = ['5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM']
  const times = day === 0 || day === 6 ? ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', ...dinner] : dinner
  if (date !== today()) return times
  const now = new Date()
  return times.filter(time => {
    const [clock, period] = time.split(' ')
    const [hours, minutes] = clock.split(':').map(Number)
    return (hours % 12 + (period === 'PM' ? 12 : 0)) * 60 + minutes > now.getHours() * 60 + now.getMinutes()
  })
}
function Field({ label, name, type = 'text', value, change, error, min }) {
  const autoComplete = { name: 'name', email: 'email', phone: 'tel' }[name]
  return <div className="field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} value={value} onChange={change} min={min} required autoComplete={autoComplete} maxLength={type === 'date' ? undefined : 254} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} />{error && <small id={`${name}-error`} role="alert">{error}</small>}</div>
}
function Success({ title, message, action, actionText }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  return <div className="success" ref={ref} tabIndex="-1" role="status"><span aria-hidden="true">✓</span><h2>{title}</h2><p>{message}</p><button className="text-button dark" onClick={() => { action(); requestAnimationFrame(() => document.querySelector('form input')?.focus()) }}>{actionText} <Arrow /></button></div>
}

function About() { return <><PageHero eyebrow="Our story" title={<>Made for<br /><em>meaningful moments.</em></>} image={images.contact} /><section className="story section reveal"><div><p className="eyebrow">A neighborhood table</p><h2>Born from a love<br />of <em>good company.</em></h2></div><div><p>SAVOR opened in 2016 with a simple idea: a remarkable meal has very little to do with spectacle and everything to do with how it makes you feel. It is the clink of a glass, the surprise of a flavor you know and somehow don’t, and the comfort of a table held for you.</p><p>What began as a 28-seat neighborhood restaurant is now a destination for people who care deeply about where their food comes from and who they share it with.</p></div></section><section className="philosophy"><div className="philosophy-image"><img loading="lazy" decoding="async" src={images.chef} alt="A chef preparing food" /></div><div className="philosophy-copy reveal"><p className="eyebrow">The kitchen</p><h2>Craft without<br /><em>the noise.</em></h2><p>Chef Amara Voss leads a kitchen that cooks with clarity and conviction. Her food is instinctive but precise, guided by the best local ingredients and a fascination with the unexpected.</p><div className="signature">A. Voss</div></div></section><section className="values section"><p className="eyebrow reveal">What guides us</p><div className="values-grid">{[['01','Season first','We let the market write the menu, working closely with small farms and independent producers.'],['02','Made with care','Technique is in service of flavor. Nothing arrives on the plate without a reason.'],['03','Generous by nature','From our welcome to our last bite, we believe hospitality is a feeling.']].map(([number,title,text]) => <article className="reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></> }

function Contact() {
  const [data, setData] = useState({ name: '', email: '', message: '' }); const [errors, setErrors] = useState({}); const [sent, setSent] = useState(false)
  const change = (event) => { setData({ ...data, [event.target.name]: event.target.value }); setErrors({ ...errors, [event.target.name]: '' }) }
  const submit = (event) => { event.preventDefault(); const next = {}; Object.keys(data).forEach((key) => { if (!data[key].trim()) next[key] = 'This field is required.' }); if (data.email && !/^\S+@\S+\.\S+$/.test(data.email.trim())) next.email = 'Enter a valid email address.'; if (Object.keys(next).length) { setErrors(next); requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus()); return }; setSent(true) }
  return <><PageHero eyebrow="Contact" title={<>Come find<br /><em>your place.</em></>} image={images.contact} /><section className="contact-layout section"><div className="contact-info reveal"><p className="eyebrow">SAVOR Restaurant</p><h2>88 Vallejo Street<br />San Francisco, CA<br />94111</h2><p className="demo-note">Sample restaurant details for this portfolio concept. Contact and reservation forms are previews.</p><div className="hours"><span>DINNER</span><p>Tuesday — Sunday: 5:30 PM — 10:30 PM<br />Monday: Closed</p></div><div className="hours"><span>BRUNCH</span><p>Saturday — Sunday: 11:00 AM — 2:30 PM</p></div></div><div className="contact-form form-wrap reveal">{sent ? <Success title="Your message preview is ready." message="This is a portfolio demo. Your message has not been sent, and your details stay in this page." action={() => setSent(false)} actionText="Edit message" /> : <form onSubmit={submit} noValidate><FormHeading title="Preview a message" /><Field label="Full name" name="name" value={data.name} change={change} error={errors.name} /><Field label="Email address" name="email" type="email" value={data.email} change={change} error={errors.email} /><div className="field"><label htmlFor="message">Your message</label><textarea id="message" name="message" required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} maxLength="5000" rows="6" value={data.message} onChange={change} placeholder="How can we help?" />{errors.message && <small id="message-error" role="alert">{errors.message}</small>}</div><button className="button dark-button submit-button" type="submit">Preview message <Arrow /></button><p className="form-footnote">Portfolio demo only. No message or email will be sent.</p></form>}</div></section><section className="map-placeholder section reveal"><div className="map-grid"></div><div className="map-pin"><span>✦</span><b>SAVOR</b><p>88 Vallejo Street</p><p>Illustrative location · portfolio concept</p></div></section></>
}

function Footer({ go }) { return <footer><div className="footer-top"><a className="brand" href="#/home">SAVOR<span>·</span></a><p>A seasonal dining room<br />in San Francisco.</p><button className="button outline-button" onClick={() => go('reservations')}>Reserve a table <Arrow /></button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SAVOR · Portfolio concept</span><div>{links.slice(1).map(([label,id]) => <a href={`#/${id}`} key={id}>{label}</a>)}</div><span>Sample menu, location and team</span></div></footer> }
function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }

createRoot(document.getElementById('root')).render(<App />)

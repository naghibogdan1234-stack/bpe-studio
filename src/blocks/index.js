/* Registrul de blocuri. Ca să adaugi un bloc nou:
   1. creează blocks/NumeBloc.jsx (pornește de la blocks/_Template.jsx)
   2. adaugă-l aici
   3. folosește-l în site.config.jsx: { type: 'NumeBloc', props: { ... } } */
import Hero from './Hero.jsx'
import Marquee from './Marquee.jsx'
import ParticleStory from './ParticleStory.jsx'
import Statement from './Statement.jsx'
import Gallery from './Gallery.jsx'
import CallToAction from './CallToAction.jsx'
import ProcessSteps from './ProcessSteps.jsx'
import TetrisWall from './TetrisWall.jsx'
import PriceTicket from './PriceTicket.jsx'
import Team from './Team.jsx'
import SandText from './SandText.jsx'
import Contact from './Contact.jsx'
import Template from './_Template.jsx'

export const blocks = { Hero, Marquee, ParticleStory, Statement, Gallery, CallToAction, ProcessSteps, TetrisWall, PriceTicket, Team, SandText, Contact, Template }

// Browser CustomEvent name used to broadcast a saved/removed profile photo so
// the header (AppNavbar, public Navbar) can update immediately without a
// full page refresh. Dispatched by AccountSection, listened for by both navbars.
export const AVATAR_UPDATED_EVENT = 'mytechz:avatar-updated'

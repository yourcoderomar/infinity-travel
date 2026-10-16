// Security + booking checks against the live API with the public key: node --env-file=.env supabase/check.mjs
// Leaves one test reservation named "TEST check.mjs" behind; delete it in the dashboard.
import assert from 'node:assert/strict'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
const call = (path, init = {}) => fetch(`${url}/rest/v1/${path}`, {
  ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }))
const phone = `+20 10 ${String(Math.random()).slice(2, 10)}` // fresh number per run so the per-phone throttle doesn't trip
const book = (args) => call('rpc/create_reservation', { method: 'POST', body: JSON.stringify(args) })

const trips = await call('trips?select=id,slug,trip_options(departures(id,departs_on,seats)),packages(id,price_egp)')
assert.equal(trips.status, 200)
assert.ok(trips.body.length >= 1, 'no published trips')
const dahab = trips.body.find((t) => t.slug === 'dahab')
const other = trips.body.find((t) => t.slug !== 'dahab')
const dep = dahab.trip_options[0].departures[0]
const pkg = dahab.packages[0]
assert.ok(dep && pkg, 'dahab has no departure/package')

// public can't read or write reservations directly
const read = await call('reservations?select=*')
assert.ok(read.status >= 400 || read.body.length === 0, `reservations readable: ${JSON.stringify(read.body).slice(0, 200)}`)
const write = await call('reservations', { method: 'POST', body: JSON.stringify({ departure_id: dep.id, package_id: pkg.id, travellers: 1, name: 'x', phone: '0100000000' }) })
assert.ok(write.status >= 400, 'direct insert into reservations allowed')
// public can't edit the catalogue
const edit = await call(`packages?id=eq.${pkg.id}`, { method: 'PATCH', body: JSON.stringify({ price_egp: 1 }) })
const after = await call(`packages?id=eq.${pkg.id}&select=price_egp`)
assert.equal(after.body[0].price_egp, pkg.price_egp, `anon changed a price (PATCH ${edit.status})`)

// RPC rejects bad input with a guest-readable message
const bad = async (args, why) => {
  const r = await book({ departure_id: dep.id, package_id: pkg.id, travellers: 1, name: 'TEST check.mjs', phone: '01001234567', ...args })
  assert.equal(r.status, 400, `${why}: expected 400, got ${r.status} ${JSON.stringify(r.body)}`)
  assert.equal(r.body.code, 'P0001', `${why}: ${JSON.stringify(r.body)}`)
}
await bad({ package_id: other.packages[0].id }, 'package from another trip')
await bad({ departure_id: '00000000-0000-0000-0000-000000000000' }, 'unknown departure')
await bad({ phone: 'abc' }, 'bad phone')
await bad({ email: 'nope' }, 'bad email')
await bad({ travellers: (dep.seats ?? 20) + 1 }, 'over capacity / >20')

// happy path, total computed server side
const ok = await book({ departure_id: dep.id, package_id: pkg.id, travellers: 2, name: 'TEST check.mjs', phone, total_egp: 1 })
assert.ok(ok.status >= 400, 'unknown arg total_egp should be rejected by PostgREST') // client can't even pass a price
const ok2 = await book({ departure_id: dep.id, package_id: pkg.id, travellers: 2, name: 'TEST check.mjs', phone })
assert.equal(ok2.status, 200, JSON.stringify(ok2.body))
assert.match(ok2.body, /^[0-9a-f-]{36}$/)
console.log('all checks passed, reservation', ok2.body)

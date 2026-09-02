// The seat bands Stripe sells, in one place. create-checkout-session prices them and
// stripe-webhook grants their seats; keeping them in two files meant a band added to one
// took money the other could not fulfil (ACTION-ITEMS P4).
export const BANDS = [
  { key: "1-25", pence: 99000, seats: 25, label: "Attest AI Foundation, 1 to 25 staff, 12 months" },
  { key: "26-50", pence: 175000, seats: 50, label: "Attest AI Foundation, 26 to 50 staff, 12 months" },
  // "Over 50" is deliberately absent: that band is quoted on headcount, so it stays a
  // form submission and never reaches Stripe.
];
export const SEATS = Object.fromEntries(BANDS.map((b) => [b.key, b.seats]));

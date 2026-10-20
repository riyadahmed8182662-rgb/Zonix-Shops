# ZonixShop Bangladesh — Security Specification

## 1. Data Invariants
1. **Public Catalog Isolation**: Only published products (`status == 'published'`) and active categories (`active == true`) can be read by anonymous/public users.
2. **Order Tamper-Proofing**: Customers cannot manipulate order `subtotal`, `discount`, `shippingFee`, `total`, `paymentStatus`, `orderStatus`, or product prices.
3. **Identity Verification & Anti-Spoofing**: Only verified users (`request.auth.uid == userId`) can read or write their own user profile data. No customer can grant themselves `role: 'admin'`.
4. **Admin Access Defense**: Administrative operations (product create/update/delete, order status mutation, inventory restock, settings update, audit viewing) require explicit document presence in `/admins/$(request.auth.uid)`.
5. **Audit Trail Immutability**: Audit logs are append-only by authenticated actors/admins and can never be updated or deleted.
6. **Stock Integrity**: Stock deduction and order placement are executed through trusted transactional validation preventing overselling and client-side price tampering.
7. **Support Ticket Boundary**: Customers can only read and create support tickets where `customerId == request.auth.uid`.

## 2. The "Dirty Dozen" Payloads (Must be REJECTED with PERMISSION_DENIED)
1. **Payload 1 (Self-Elevation Attack)**: Customer tries to create/update `/users/{uid}` with `role: 'admin'`.
2. **Payload 2 (Ghost Field Injection)**: Customer writes to `/users/{uid}` with `isAdmin: true` or `shadowPrivilege: 9999`.
3. **Payload 3 (Price Forgery in Order)**: Customer creates order setting item price to 1 BDT for a 5,000 BDT item.
4. **Payload 4 (Direct Payment Status Modification)**: Customer sends update to `/orders/{orderId}` changing `paymentStatus: 'paid'` without backend verification.
5. **Payload 5 (Order Status Leap)**: Customer updates `/orders/{orderId}` to mark `orderStatus: 'delivered'`.
6. **Payload 6 (Other Customer Order Snoop)**: User A attempts `get` or `list` on `/orders/{orderId}` belonging to User B.
7. **Payload 7 (Unpublished Draft Snooping)**: Anonymous user attempts to read draft or archived products.
8. **Payload 8 (Product Price Mutation)**: Unauthenticated or non-admin user calls `update` on `/products/{productId}` setting `price: 10`.
9. **Payload 9 (Coupon Forgery)**: Non-admin user creates a new coupon code giving 99% discount in `/coupons/{code}`.
10. **Payload 10 (Store Settings Sabotage)**: Non-admin user modifies `/storeSettings/general` to redirect bKash merchant number.
11. **Payload 11 (Audit Log Destruction)**: User attempts to `delete` or `update` records in `/auditLogs/{logId}`.
12. **Payload 12 (Inventory Tampering)**: Customer attempts direct write to `/inventoryEvents/{id}` or alters product stock directly without validated transaction.

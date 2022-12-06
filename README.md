# radix-js

### Build manifest with transaction spec

```typescript
import { ManifestBuilder, TransactionSpec as TS } from '@radixdlt/wallet-sdk';

const manifest = new ManifestBuilder()
    .callMethod('component_tdx_a_1qguw8y8g437nnkusxukllha7l7c0cy658g34jyucm7tqkjanvl', 'withdraw_by_amount', [
        TS.Decimal("1"),
        TS.ResourceAddress("resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9")
    ])
    .takeFromWorktop('resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9', 'xrd_bucket')
    .callMethod('component_tdx_a_1qfdcf5nvl9qkfv743p7dzj7zse5ex50p3cqnelg6puuqd4m540', 'buy_gumball', [ TS.Bucket("xrd_bucket") ])
    .callMethod('component_tdx_a_1qguw8y8g437nnkusxukllha7l7c0cy658g34jyucm7tqkjanvl', 'deposit_batch', [TS.Expression("ENTIRE_WORKTOP")])
    .build();
```

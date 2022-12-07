# radix-js

### Build manifest with transaction spec

```typescript
import {ManifestBuilder, Decimal, ResourceAddress, Bucket, Expression} from '@radixdlt/wallet-sdk';

const manifest = new ManifestBuilder()
    .callMethod('component_tdx_a_1qguw8y8g437nnkusxukllha7l7c0cy658g34jyucm7tqkjanvl', 'withdraw_by_amount', [
        Decimal("1"),
        ResourceAddress("resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9")
    ])
    .takeFromWorktop('resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9', 'xrd_bucket')
    .callMethod('component_tdx_a_1qfdcf5nvl9qkfv743p7dzj7zse5ex50p3cqnelg6puuqd4m540', 'buy_gumball', [
        Bucket("xrd_bucket")
    ])
    .callMethod('component_tdx_a_1qguw8y8g437nnkusxukllha7l7c0cy658g34jyucm7tqkjanvl', 'deposit_batch', [
        Expression("ENTIRE_WORKTOP")
    ])
    .build();
```

More example can be found [here](./lib/__tests__/manifest-builder.spec.ts).
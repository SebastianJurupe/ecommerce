import { auth } from "./ecommerce.auth.locations"
import { home } from "./ecommerce.home.locations"
import { categories } from "./ecommerce.categories.locations"
import { inbox } from "./ecommerce.inbox.locations"
import { basket } from "./ecommerce.basket.locations"
import { profile } from "./ecommerce.profile.locations"
import { toolbar } from './ecommerce.toolbar.locations';
import { general } from './ecommerce.general.locations';

export const EcommerceTranslations = {
    es_ES: {
        ...auth.es_ES,
        ...home.es_ES,
        ...categories.es_ES,
        ...inbox.es_ES,
        ...basket.es_ES,
        ...profile.es_ES,
        ...toolbar.es_ES,
        ...general.es_ES,
    },
    en_US: {
        ...auth.en_US,
        ...home.en_US,
        ...categories.en_US,
        ...inbox.en_US,
        ...basket.en_US,
        ...profile.en_US,
        ...toolbar.en_US,
        ...general.en_US,
    }
}
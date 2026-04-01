package com.tasty.tasty.util;

import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class IngredientSubstitute {

    private static final Map<String, List<String>> SUBSTITUTES = new HashMap<>();

    static {
        SUBSTITUTES.put("butter", Arrays.asList("Oil", "Ghee", "Coconut Oil", "Margarine"));
        SUBSTITUTES.put("milk", Arrays.asList("Almond Milk", "Soy Milk", "Oat Milk", "Coconut Milk"));
        SUBSTITUTES.put("egg", Arrays.asList("Flax Egg", "Banana", "Applesauce", "Yogurt"));
        SUBSTITUTES.put("sugar", Arrays.asList("Honey", "Jaggery", "Maple Syrup", "Stevia"));
        SUBSTITUTES.put("cream", Arrays.asList("Coconut Cream", "Cashew Cream", "Greek Yogurt"));
        SUBSTITUTES.put("cheese", Arrays.asList("Paneer", "Tofu", "Nutritional Yeast"));
        SUBSTITUTES.put("flour", Arrays.asList("Almond Flour", "Oat Flour", "Coconut Flour", "Besan"));
        SUBSTITUTES.put("rice", Arrays.asList("Quinoa", "Cauliflower Rice", "Bulgur Wheat", "Couscous"));
        SUBSTITUTES.put("oil", Arrays.asList("Butter", "Ghee", "Coconut Oil", "Olive Oil"));
        SUBSTITUTES.put("ghee", Arrays.asList("Butter", "Oil", "Coconut Oil"));
        SUBSTITUTES.put("paneer", Arrays.asList("Tofu", "Cottage Cheese", "Halloumi"));
        SUBSTITUTES.put("yogurt", Arrays.asList("Sour Cream", "Coconut Yogurt", "Buttermilk"));
        SUBSTITUTES.put("onion", Arrays.asList("Shallots", "Leeks", "Scallions", "Chives"));
        SUBSTITUTES.put("garlic", Arrays.asList("Garlic Powder", "Asafoetida", "Ginger", "Shallots"));
        SUBSTITUTES.put("tomato", Arrays.asList("Red Bell Pepper", "Tamarind", "Canned Tomato"));
        SUBSTITUTES.put("potato", Arrays.asList("Sweet Potato", "Turnip", "Cauliflower"));
        SUBSTITUTES.put("chicken", Arrays.asList("Tofu", "Paneer", "Mushroom", "Soy Chunks"));
        SUBSTITUTES.put("salt", Arrays.asList("Soy Sauce", "Rock Salt", "Black Salt", "Lemon Juice"));
        SUBSTITUTES.put("lemon", Arrays.asList("Lime", "Vinegar", "Tamarind", "Citric Acid"));
        SUBSTITUTES.put("bread", Arrays.asList("Tortilla", "Roti", "Lettuce Wrap", "Rice Cake"));
        SUBSTITUTES.put("pasta", Arrays.asList("Zucchini Noodles", "Rice Noodles", "Spaghetti Squash"));
        SUBSTITUTES.put("sour cream", Arrays.asList("Greek Yogurt", "Coconut Cream", "Cashew Cream"));
        SUBSTITUTES.put("honey", Arrays.asList("Maple Syrup", "Agave Nectar", "Date Syrup", "Jaggery"));
        SUBSTITUTES.put("coconut", Arrays.asList("Almond", "Cashew", "Desiccated Coconut"));
    }

    public List<String> getSubstitutes(String ingredient) {
        String key = ingredient.toLowerCase().trim();
        return SUBSTITUTES.getOrDefault(key, Collections.emptyList());
    }

    public Map<String, List<String>> getAllSubstitutes() {
        return Collections.unmodifiableMap(SUBSTITUTES);
    }
}

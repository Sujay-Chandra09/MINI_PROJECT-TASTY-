package com.tasty.tasty.controller;

import com.tasty.tasty.model.Recipe;
import com.tasty.tasty.model.Comment;
import com.tasty.tasty.repository.RecipeRepository;
import com.tasty.tasty.model.User;
import com.tasty.tasty.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@CrossOrigin
@RequestMapping("/recipes")
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public RecipeController(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    // 👉 GET RECIPES (PAGINATED) — ?page=0&size=20
    @GetMapping
    public Map<String, Object> getAllRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, Math.min(size, 50), Sort.by("likeCount").descending());
        Page<Recipe> recipePage = recipeRepository.findAll(pageRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("content", recipePage.getContent());
        response.put("totalPages", recipePage.getTotalPages());
        response.put("totalElements", recipePage.getTotalElements());
        response.put("currentPage", recipePage.getNumber());
        response.put("hasNext", recipePage.hasNext());
        return response;
    }

    // 👉 ADD RECIPE
    @PostMapping
    public Recipe addRecipe(@RequestBody Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    // 👉 DELETE RECIPE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable("id") String id) {
        if (!ObjectId.isValid(id)) return ResponseEntity.badRequest().body("Invalid ID");
        recipeRepository.deleteById(new ObjectId(id));
        return ResponseEntity.ok("Deleted");
    }

    // 👉 LIKE RECIPE
    @PostMapping("/{id}/like")
    public Recipe likeRecipe(@PathVariable("id") String id, HttpServletRequest request) {
        if(!ObjectId.isValid(id)) return null;
        ObjectId objId = new ObjectId(id);

        String userIdStr = (String) request.getAttribute("userId");
        if(userIdStr == null) throw new RuntimeException("Not Authenticated");
        ObjectId userId = new ObjectId(userIdStr);

        Recipe recipe = recipeRepository.findById(objId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (recipe != null && user != null) {
            
            // Initialize arrays if null
            if (recipe.getLikedBy() == null) recipe.setLikedBy(new ArrayList<>());
            if (user.getFavorites() == null) user.setFavorites(new ArrayList<>());

            // Toggle logic
            if (recipe.getLikedBy().contains(userId)) {
                recipe.getLikedBy().remove(userId);
                recipe.setLikeCount(Math.max(0, recipe.getLikeCount() - 1));
                user.getFavorites().remove(objId);
            } else {
                recipe.getLikedBy().add(userId);
                recipe.setLikeCount(recipe.getLikeCount() + 1);
                user.getFavorites().add(objId);
            }

            userRepository.save(user);
            recipeRepository.save(recipe);
        }
        return recipe;
    }

    // 👉 ADD COMMENT
    @PostMapping("/{id}/comments")
    public Recipe addComment(@PathVariable("id") String id, @RequestBody Comment comment, HttpServletRequest request) {
        if(!ObjectId.isValid(id)) return null;

        String userIdStr = (String) request.getAttribute("userId");
        if(userIdStr == null) throw new RuntimeException("Not Authenticated");
        ObjectId userId = new ObjectId(userIdStr);

        User user = userRepository.findById(userId).orElse(null);
        String realName = (user != null && user.getName() != null) ? user.getName() : "Anonymous User";
        comment.setCommenterName(realName);

        ObjectId objId = new ObjectId(id);
        Recipe recipe = recipeRepository.findById(objId).orElse(null);
        if (recipe != null) {
            if (recipe.getComments() == null) {
                recipe.setComments(new ArrayList<>());
            }
            recipe.getComments().add(comment);
            recipeRepository.save(recipe);
        }
        return recipe;
    }

    // 👉 GET SINGLE RECIPE
    @GetMapping("/{id}")
    public Recipe getRecipeById(@PathVariable("id") String id){
        if(!ObjectId.isValid(id)) return null;
        ObjectId objId = new ObjectId(id);
        return recipeRepository.findById(objId).orElse(null);
    }

    // 👉 QUANTITY
    @GetMapping("/{id}/quantity")
    public Recipe calculateQuantity(
            @PathVariable("id") String id,
            @RequestParam("members") int members){
        if(!ObjectId.isValid(id)) return null;
        ObjectId objId = new ObjectId(id);
        Recipe recipe = recipeRepository.findById(objId).orElse(null);
        if(recipe == null) return null;
        recipe.getIngredients().forEach(i -> {
            i.setQuantity(i.getQuantity() * members);
        });
        return recipe;
    }

    // 👉 SEARCH
    @GetMapping("/search")
    public List<Recipe> searchRecipe(@RequestParam("name") String name){
        List<Recipe> recipes = recipeRepository.searchByTitle(name);
        return recipes.stream().limit(20).toList();
    }

    // 👉 RECOMMEND
    @PostMapping("/recommend")
    public List<Recipe> recommendRecipes(@RequestBody List<String> ingredients){
        List<Recipe> result = new ArrayList<>();
        for(String ing : ingredients){
            result.addAll(recipeRepository.recommendRecipes(ing));
        }
        return result.stream().distinct().limit(20).toList();
    }

    // 👉 TIME FILTER
    @GetMapping("/filter/time")
    public List<Recipe> filterByTime(@RequestParam("minutes") int minutes){
        return recipeRepository.findByCookingTimeLessThanEqual(minutes);
    }

    // 👉 BUDGET FILTER (paginated scan — max 2000 checked per call)
    @GetMapping("/filter/budget")
    public List<Recipe> filterByBudget(@RequestParam("amount") int amount){
        List<Recipe> result = new ArrayList<>();
        int pageNum = 0;
        int checked = 0;
        while (result.size() < 20 && checked < 5000) {
            Page<Recipe> page = recipeRepository.findAll(PageRequest.of(pageNum, 200));
            if (!page.hasContent()) break;
            for (Recipe r : page.getContent()) {
                if (r.getIngredients() != null) {
                    int totalCost = r.getIngredients().stream().mapToInt(i -> i.getPrice()).sum();
                    if (totalCost <= amount) {
                        result.add(r);
                        if (result.size() >= 20) break;
                    }
                }
            }
            checked += page.getContent().size();
            if (!page.hasNext()) break;
            pageNum++;
        }
        return result;
    }

    // INGREDIENT SUBSTITUTE
    @GetMapping("/substitute")
    public java.util.Map<String, Object> getSubstitute(@RequestParam("ingredient") String ingredient) {
        com.tasty.tasty.util.IngredientSubstitute substituteUtil = new com.tasty.tasty.util.IngredientSubstitute();
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("ingredient", ingredient);
        result.put("substitutes", substituteUtil.getSubstitutes(ingredient));
        return result;
    }

    // ALL SUBSTITUTES MAP
    @GetMapping("/substitutes/all")
    public java.util.Map<String, java.util.List<String>> getAllSubstitutes() {
        com.tasty.tasty.util.IngredientSubstitute substituteUtil = new com.tasty.tasty.util.IngredientSubstitute();
        return substituteUtil.getAllSubstitutes();
    }

}
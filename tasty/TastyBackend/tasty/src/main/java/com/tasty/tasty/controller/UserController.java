package com.tasty.tasty.controller;

import com.tasty.tasty.model.MealSchedule;
import com.tasty.tasty.model.Recipe;
import com.tasty.tasty.model.User;
import com.tasty.tasty.repository.UserRepository;
import com.tasty.tasty.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.tasty.tasty.repository.MealScheduleRepository;
import com.tasty.tasty.repository.RecipeRepository;
import com.tasty.tasty.model.MealReminder;
import com.tasty.tasty.repository.MealReminderRepository;
@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RecipeRepository recipeRepository;
    private final MealScheduleRepository mealScheduleRepository;
    private final MealReminderRepository mealReminderRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ✅ Constructor Injection (SAFE METHOD)
    public UserController(UserRepository userRepository,
                      JwtUtil jwtUtil,
                      RecipeRepository recipeRepository,
                      MealScheduleRepository mealScheduleRepository,
                      MealReminderRepository mealReminderRepository){

    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
    this.recipeRepository = recipeRepository;
    this.mealScheduleRepository = mealScheduleRepository;
    this.mealReminderRepository = mealReminderRepository;
}
    // 👉 SIGNUP API
    @PostMapping("/signup")
    public String signup(@RequestBody User user){

        User existingUser = userRepository
        .findByEmail(user.getEmail())
        .orElse(null);

        if(existingUser != null){
            return "Email already exists";
        }

        String hashedPassword = encoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        userRepository.save(user);

        return "Signup Successful";
    }

    // 👉 LOGIN API
    @PostMapping("/login")
    public String login(@RequestBody User user){

        User existingUser = userRepository
        .findByEmail(user.getEmail())
        .orElse(null);
        if(existingUser == null){
            return "User Not Found";
        }

        if(!encoder.matches(user.getPassword(), existingUser.getPassword())){
            return "Invalid Password";
        }

        // ✅ JWT Token Generate
        String token = jwtUtil.generateToken(existingUser.getId().toString());

        return token;
    }
  @PostMapping("/favorites/{recipeId}")
public ResponseEntity<?> addFavorite(
        @PathVariable("recipeId") String recipeId,
        HttpServletRequest request
){

    String userId = request.getAttribute("userId").toString();

    User user = userRepository
        .findById(new ObjectId(userId))
        .orElseThrow();

    // ⭐ IMPORTANT FIX ⭐
    if(user.getFavorites() == null){
        user.setFavorites(new ArrayList<>());
    }

    user.getFavorites().add(new ObjectId(recipeId));

    userRepository.save(user);
    return ResponseEntity.ok("Added to favorites");
}
@GetMapping("/favorites")
public List<Recipe> getFavorites(HttpServletRequest request){

    String userId = (String) request.getAttribute("userId");

    if(userId == null){
        throw new RuntimeException("User not authenticated");
    }

    ObjectId uid = new ObjectId(userId);

    User user = userRepository.findById(uid).orElse(null);

    if(user == null || user.getFavorites() == null){
        return new ArrayList<>();
    }

    List<ObjectId> recipeIds = user.getFavorites();

    return recipeRepository.findAllById(recipeIds);
}
@PostMapping("/schedule")
public String setSchedule(@RequestBody MealSchedule schedule,
                          HttpServletRequest request){

    String userId = (String) request.getAttribute("userId");

    schedule.setUserId(new ObjectId(userId));

    mealScheduleRepository.save(schedule);

    return "Schedule Saved";
}
@GetMapping("/feed")
public List<Recipe> personalizedFeed(HttpServletRequest request){

    String userId = (String) request.getAttribute("userId");

    ObjectId uid = new ObjectId(userId);

    String today =
            java.time.LocalDate.now()
            .getDayOfWeek()
            .toString();

    today = today.substring(0,1)
            + today.substring(1).toLowerCase();

    MealSchedule schedule =
            mealScheduleRepository
            .findByUserIdAndDay(uid,today);

    if(schedule == null) {
        return recipeRepository.findAll()
                .stream()
                .limit(20)
                .toList();
    }

    String pref = schedule.getPreference();

    return recipeRepository
        .findByTypeIgnoreCase(pref)
        .stream()
        .filter(r -> r.getType() != null && r.getType().equalsIgnoreCase(pref))
        .limit(20)
        .toList();
}

// 👉 GROCERY LIST GENERATOR
@GetMapping("/grocery-list")
public List<com.tasty.tasty.model.Ingredient> generateGroceryList(HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    ObjectId uid = new ObjectId(userId);
    User user = userRepository.findById(uid).orElse(null);

    List<com.tasty.tasty.model.Ingredient> groceryList = new ArrayList<>();
    if(user == null || user.getFavorites() == null) return groceryList;

    List<Recipe> favoriteRecipes = recipeRepository.findAllById(user.getFavorites());
    Map<String, com.tasty.tasty.model.Ingredient> ingredientMap = new HashMap<>();

    for(Recipe recipe : favoriteRecipes) {
        if (recipe.getIngredients() != null) {
            for(com.tasty.tasty.model.Ingredient ing : recipe.getIngredients()) {
                String name = ing.getName().toLowerCase().trim();
                if(ingredientMap.containsKey(name)) {
                    com.tasty.tasty.model.Ingredient existing = ingredientMap.get(name);
                    existing.setQuantity(existing.getQuantity() + ing.getQuantity());
                    existing.setPrice(existing.getPrice() + ing.getPrice());
                } else {
                    com.tasty.tasty.model.Ingredient newIng = new com.tasty.tasty.model.Ingredient();
                    newIng.setName(ing.getName());
                    newIng.setQuantity(ing.getQuantity());
                    newIng.setUnit(ing.getUnit());
                    newIng.setPrice(ing.getPrice());
                    ingredientMap.put(name, newIng);
                }
            }
        }
    }
    return new ArrayList<>(ingredientMap.values());
}

// 👉 DIET ANALYTICS DASHBOARD
@GetMapping("/analytics")
public Map<String, Object> getAnalytics(HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    ObjectId uid = new ObjectId(userId);
    User user = userRepository.findById(uid).orElse(null);

    Map<String, Object> analytics = new HashMap<>();
    if(user == null || user.getFavorites() == null) {
        analytics.put("totalCalories", 0);
        analytics.put("totalProtein", 0);
        analytics.put("estimatedCost", 0);
        return analytics;
    }

    List<Recipe> favoriteRecipes = recipeRepository.findAllById(user.getFavorites());
    int totalCalories = 0;
    int totalProtein = 0;
    int estimatedCost = 0;

    for(Recipe recipe : favoriteRecipes) {
        totalCalories += recipe.getCalories();
        totalProtein += recipe.getProtein();
        if(recipe.getIngredients() != null) {
            for(com.tasty.tasty.model.Ingredient ing : recipe.getIngredients()) {
                estimatedCost += ing.getPrice();
            }
        }
    }

    analytics.put("totalCalories", totalCalories);
    analytics.put("totalProtein", totalProtein);
    analytics.put("estimatedCost", estimatedCost);
    return analytics;
}

// 👉 USER PROFILE
@GetMapping("/profile")
public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    ObjectId uid = new ObjectId(userId);
    User user = userRepository.findById(uid).orElse(null);

    if (user != null) {
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("id", user.getId().toString());
        profileData.put("name", user.getName());
        profileData.put("email", user.getEmail());
        profileData.put("favoritesCount", user.getFavorites() != null ? user.getFavorites().size() : 0);
        return ResponseEntity.ok(profileData);
    }
    return ResponseEntity.status(404).body("User not found");
}

// MEAL REMINDERS
@PostMapping("/reminders")
public MealReminder setReminder(@RequestBody MealReminder reminder, HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    reminder.setUserId(new ObjectId(userId));
    return mealReminderRepository.save(reminder);
}

@GetMapping("/reminders")
public List<MealReminder> getReminders(HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    return mealReminderRepository.findByUserId(new ObjectId(userId));
}

@DeleteMapping("/reminders/{id}")
public ResponseEntity<?> deleteReminder(@PathVariable("id") String id, HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    mealReminderRepository.deleteByIdAndUserId(new ObjectId(id), new ObjectId(userId));
    return ResponseEntity.ok("Reminder deleted");
}

// ENHANCED ANALYTICS WITH BREAKDOWN
@GetMapping("/analytics/detailed")
public Map<String, Object> getDetailedAnalytics(HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    ObjectId uid = new ObjectId(userId);
    User user = userRepository.findById(uid).orElse(null);

    Map<String, Object> analytics = new HashMap<>();
    if (user == null || user.getFavorites() == null) {
        analytics.put("totalCalories", 0);
        analytics.put("totalProtein", 0);
        analytics.put("estimatedCost", 0);
        analytics.put("vegCount", 0);
        analytics.put("nonVegCount", 0);
        analytics.put("veganCount", 0);
        analytics.put("recipeBreakdown", new ArrayList<>());
        return analytics;
    }

    List<Recipe> favoriteRecipes = recipeRepository.findAllById(user.getFavorites());
    int totalCalories = 0, totalProtein = 0, estimatedCost = 0;
    int vegCount = 0, nonVegCount = 0, veganCount = 0;
    List<Map<String, Object>> recipeBreakdown = new ArrayList<>();

    for (Recipe recipe : favoriteRecipes) {
        totalCalories += recipe.getCalories();
        totalProtein += recipe.getProtein();
        int recipeCost = 0;
        if (recipe.getIngredients() != null) {
            for (com.tasty.tasty.model.Ingredient ing : recipe.getIngredients()) {
                estimatedCost += ing.getPrice();
                recipeCost += ing.getPrice();
            }
        }

        String type = (recipe.getType() != null) ? recipe.getType().toLowerCase() : "";
        if (type.contains("vegan")) veganCount++;
        else if (type.contains("non-veg") || type.contains("nonveg")) nonVegCount++;
        else if (type.contains("veg")) vegCount++;

        Map<String, Object> rb = new HashMap<>();
        rb.put("title", recipe.getTitle());
        rb.put("calories", recipe.getCalories());
        rb.put("protein", recipe.getProtein());
        rb.put("cost", recipeCost);
        rb.put("type", recipe.getType());
        recipeBreakdown.add(rb);
    }

    analytics.put("totalCalories", totalCalories);
    analytics.put("totalProtein", totalProtein);
    analytics.put("estimatedCost", estimatedCost);
    analytics.put("vegCount", vegCount);
    analytics.put("nonVegCount", nonVegCount);
    analytics.put("veganCount", veganCount);
    analytics.put("recipeBreakdown", recipeBreakdown);
    return analytics;
}

// GET ALL SCHEDULES
@GetMapping("/schedule")
public List<MealSchedule> getSchedules(HttpServletRequest request) {
    String userId = (String) request.getAttribute("userId");
    return mealScheduleRepository.findByUserId(new ObjectId(userId));
}

// DELETE SCHEDULE
@DeleteMapping("/schedule/{id}")
public ResponseEntity<?> deleteSchedule(@PathVariable("id") String id) {
    mealScheduleRepository.deleteById(new ObjectId(id));
    return ResponseEntity.ok("Schedule deleted");
}
}
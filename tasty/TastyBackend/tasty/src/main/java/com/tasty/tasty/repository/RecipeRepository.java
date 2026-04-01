package com.tasty.tasty.repository;

import com.tasty.tasty.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

import org.bson.types.ObjectId;




public interface RecipeRepository extends MongoRepository<Recipe,ObjectId>{
    List<Recipe> findByIngredientsNameContainingIgnoreCase(String name);
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findByCookingTimeLessThanEqual(int time);
    List<Recipe> findByTypeIgnoreCase(String type);
    
    // Fallback for previous code expectations
    default List<Recipe> recommendRecipes(String ingredient) {
        return findByIngredientsNameContainingIgnoreCase(ingredient);
    }
    
    default List<Recipe> searchByTitle(String name) {
        return findByTitleContainingIgnoreCase(name);
    }
}
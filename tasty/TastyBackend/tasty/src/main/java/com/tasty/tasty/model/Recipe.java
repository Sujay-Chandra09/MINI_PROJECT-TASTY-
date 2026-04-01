package com.tasty.tasty.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.List;
import java.util.ArrayList;
import org.bson.types.ObjectId;

@Document(collection = "recipes")
public class Recipe {

    

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    private String title;
    private String type;
    private String cuisine;
    private int calories;
    private int protein;
    private int cookingTime;
    private String image;
    private List<Ingredient> ingredients;
    private List<String> directions;

    private int likeCount = 0;
    private List<ObjectId> likedBy = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();

    // getters & setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public int getProtein() { return protein; }
    public void setProtein(int protein) { this.protein = protein; }

    public int getCookingTime() { return cookingTime; }
    public void setCookingTime(int cookingTime) { this.cookingTime = cookingTime; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }

    public List<String> getDirections() { return directions; }
    public void setDirections(List<String> directions) { this.directions = directions; }
    
    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public List<ObjectId> getLikedBy() { return likedBy; }
    public void setLikedBy(List<ObjectId> likedBy) { this.likedBy = likedBy; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
    


}
package com.tasty.tasty.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    private String name;
    private String email;
    private String password;

    // ⭐⭐⭐ CORRECT TYPE ⭐⭐⭐
    @JsonSerialize(contentUsing = ToStringSerializer.class)
    private List<ObjectId> favorites = new ArrayList<>();

    public ObjectId getId(){ return id; }
    public void setId(ObjectId id){ this.id=id; }

    public String getName(){ return name; }
    public void setName(String name){ this.name=name; }

    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email=email; }

    public String getPassword(){ return password; }
    public void setPassword(String password){ this.password=password; }

    public List<ObjectId> getFavorites(){ return favorites; }
    public void setFavorites(List<ObjectId> favorites){ this.favorites=favorites; }
}
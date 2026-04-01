package com.tasty.tasty.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

@Document(collection = "schedule")
public class MealSchedule {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;
    private String day;
    private String preference;   // Veg / NonVeg / Vegan

    public ObjectId getId(){ return id; }
    public void setId(ObjectId id){ this.id=id; }

    public ObjectId getUserId(){ return userId; }
    public void setUserId(ObjectId userId){ this.userId=userId; }

    public String getDay(){ return day; }
    public void setDay(String day){ this.day=day; }

    public String getPreference(){ return preference; }
    public void setPreference(String preference){ this.preference=preference; }
}
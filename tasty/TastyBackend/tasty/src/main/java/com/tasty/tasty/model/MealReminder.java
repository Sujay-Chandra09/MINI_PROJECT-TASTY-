package com.tasty.tasty.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reminders")
public class MealReminder {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId userId;

    private String mealType;
    private String time;
    private boolean enabled;
    private String label;

    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public ObjectId getUserId() { return userId; }
    public void setUserId(ObjectId userId) { this.userId = userId; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}

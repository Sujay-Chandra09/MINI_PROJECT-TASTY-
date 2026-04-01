package com.tasty.tasty.repository;

import com.tasty.tasty.model.MealReminder;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MealReminderRepository extends MongoRepository<MealReminder, ObjectId> {
    List<MealReminder> findByUserId(ObjectId userId);
    void deleteByIdAndUserId(ObjectId id, ObjectId userId);
}

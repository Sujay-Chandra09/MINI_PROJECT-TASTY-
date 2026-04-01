package com.tasty.tasty.repository;

import com.tasty.tasty.model.MealSchedule;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MealScheduleRepository
        extends MongoRepository<MealSchedule,ObjectId> {

    List<MealSchedule> findByUserId(ObjectId userId);

    MealSchedule findByUserIdAndDay(ObjectId userId,String day);
}
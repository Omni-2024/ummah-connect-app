package com.course_service.service.service;


import com.course_service.service.dto.CourseDTO;
import com.course_service.service.exception.CourseNotFoundException;
import com.course_service.service.model.Course;
import com.course_service.service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;


    public Course createCourse(CourseDTO dto) {
        Course course = Course.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .price(dto.getPrice())
                .discount(dto.getDiscount())
                .discountEnabled(dto.isDiscountEnabled())
                .coverImageUrl(dto.getCoverImageUrl())
                .description(dto.getDescription())
                .archived(dto.isArchived())
                .enrollmentCount(0)
                .totalReviewCount(0)
                .totalReviewScore(0)
                .averageReviewScore(0.0)
                .build();
        return courseRepository.save(course);
    }


    public Course updateCourse(Long id, CourseDTO dto) {
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));

        existing.setName(dto.getName());
        existing.setSlug(dto.getSlug());
        existing.setPrice(dto.getPrice());
        existing.setDiscount(dto.getDiscount());
        existing.setDiscountEnabled(dto.isDiscountEnabled());
        existing.setCoverImageUrl(dto.getCoverImageUrl());
        existing.setDescription(dto.getDescription());
        existing.setArchived(dto.isArchived());

        return courseRepository.save(existing);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new CourseNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }


    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}

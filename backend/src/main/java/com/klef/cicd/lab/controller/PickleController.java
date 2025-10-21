package com.klef.cicd.lab.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.klef.cicd.lab.entity.Pickle;
import com.klef.cicd.lab.service.PickleService;

@RestController
@RequestMapping("/pickleapi/")
@CrossOrigin(origins = "*")
public class PickleController {

    @Autowired
    private PickleService pickleService;

    @GetMapping("/")
    public String home() {
        return "Pickle Order API Running Successfully!";
    }

    // Add Pickle
    @PostMapping("/add")
    public ResponseEntity<?> addPickle(@RequestBody Pickle pickle) {
        try {
            Pickle saved = pickleService.addPickle(pickle);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Get All Pickles
    @GetMapping("/all")
    public ResponseEntity<List<Pickle>> getAllPickles() {
        List<Pickle> list = pickleService.getAllPickles();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // Get by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPickleById(@PathVariable int id) {
        Pickle pickle = pickleService.getPickleById(id);
        if (pickle != null) {
            return new ResponseEntity<>(pickle, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Pickle with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    // Update Pickle
    @PutMapping("/update")
    public ResponseEntity<?> updatePickle(@RequestBody Pickle pickle) {
        try {
            Pickle updated = pickleService.updatePickle(pickle);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Delete Pickle
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePickle(@PathVariable int id) {
        Pickle existing = pickleService.getPickleById(id);
        if (existing != null) {
            pickleService.deletePickleById(id);
            return new ResponseEntity<>("Pickle with ID " + id + " deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Pickle with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }
}

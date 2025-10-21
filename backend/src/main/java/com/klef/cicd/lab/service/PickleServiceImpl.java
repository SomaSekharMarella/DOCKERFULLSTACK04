package com.klef.cicd.lab.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.klef.cicd.lab.entity.Pickle;
import com.klef.cicd.lab.repository.PickleRepository;

@Service
public class PickleServiceImpl implements PickleService {

    @Autowired
    private PickleRepository pickleRepository;

    @Override
    public Pickle addPickle(Pickle pickle) {
        // check if ID already exists
        Optional<Pickle> existing = pickleRepository.findById(pickle.getId());
        if (existing.isPresent()) {
            throw new RuntimeException("Pickle with ID " + pickle.getId() + " already exists!");
        }
        return pickleRepository.save(pickle);
    }

    @Override
    public List<Pickle> getAllPickles() {
        return pickleRepository.findAll();
    }

    @Override
    public Pickle getPickleById(int id) {
        Optional<Pickle> opt = pickleRepository.findById(id);
        return opt.orElse(null);
    }

    @Override
    public Pickle updatePickle(Pickle pickle) {
        Optional<Pickle> opt = pickleRepository.findById(pickle.getId());
        if (opt.isPresent()) {
            return pickleRepository.save(pickle);
        } else {
            throw new RuntimeException("Pickle with ID " + pickle.getId() + " not found for update!");
        }
    }

    @Override
    public void deletePickleById(int id) {
        pickleRepository.deleteById(id);
    }
}

package com.photo.controller;

import com.photo.DTO.ImageDTO;
import com.photo.service.ImageService;
import com.photo.service.S3Service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.security.test.context.support.WithMockUser;


@WebMvcTest(ImageController.class)
@ActiveProfiles("test")
public class ImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageService imageService;

    @MockBean
    private S3Service s3Service;

    @Test
    @WithMockUser(username = "testuser")
    public void testGetImage() throws Exception {
        ImageDTO mockImageDTO = new ImageDTO();
        mockImageDTO.setId(1L);

        when(imageService.getImageById(anyLong(), anyLong())).thenReturn(new ImageDTO());

        mockMvc.perform(get("/api/private/images/get-image/{imageId}", 1L)
                        .param("userId", "1"))
                .andExpect(status().isOk());
    }

}

package service

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"server/config"

	"github.com/google/go-github/v62/github"
	"golang.org/x/oauth2"
)

type GithubUploadService struct {
	cfg    *config.Config
	client *github.Client
}

func NewGithubUploadService(cfg *config.Config) *GithubUploadService {
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: cfg.GithubToken})
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	return &GithubUploadService{
		cfg:    cfg,
		client: client,
	}
}

func (s *GithubUploadService) UploadImage(ctx context.Context, fileName string, fileData []byte) (string, error) {
	content := base64.StdEncoding.EncodeToString(fileData)
	path := fmt.Sprintf("images/%s", fileName)

	opts := &github.RepositoryContentFileOptions{
		Message: github.String(fmt.Sprintf("Upload image %s", fileName)),
		Content: []byte(content),
		Branch:  github.String(s.cfg.GithubRepoBranch),
	}

	// Tạo file mới
	_, resp, err := s.client.Repositories.CreateFile(
		ctx,
		s.cfg.GithubRepoOwner,
		s.cfg.GithubRepoName,
		path,
		opts,
	)
	if err != nil {
		// Nếu file tồn tại → update
		if resp != nil && resp.StatusCode == http.StatusUnprocessableEntity {
			existing, _, _, getErr := s.client.Repositories.GetContents(
				ctx,
				s.cfg.GithubRepoOwner,
				s.cfg.GithubRepoName,
				path,
				&github.RepositoryContentGetOptions{Ref: s.cfg.GithubRepoBranch},
			)
			if getErr != nil {
				return "", getErr
			}

			opts.SHA = existing.SHA
			_, _, err = s.client.Repositories.UpdateFile(
				ctx,
				s.cfg.GithubRepoOwner,
				s.cfg.GithubRepoName,
				path,
				opts,
			)
			if err != nil {
				return "", err
			}
		} else {
			return "", err
		}
	}

	imageURL := fmt.Sprintf(
		"https://raw.githubusercontent.com/%s/%s/%s/%s",
		s.cfg.GithubRepoOwner,
		s.cfg.GithubRepoName,
		s.cfg.GithubRepoBranch,
		path,
	)

	return imageURL, nil
}
